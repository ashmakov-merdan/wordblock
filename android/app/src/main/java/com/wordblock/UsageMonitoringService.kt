package com.wordblock

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.util.Log
import android.app.usage.UsageStatsManager
import android.content.Context
import android.app.usage.UsageStats
import java.util.*
import android.os.Build
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.IntentFilter
import android.os.Handler
import android.os.Looper

class UsageMonitoringService : Service() {

    companion object {
        private const val TAG = "UsageMonitoringService"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "usage_monitoring_channel"
        private const val ACTION_CHECK_USAGE = "com.wordblock.CHECK_USAGE"
        private const val ACTION_STOP_MONITORING = "com.wordblock.STOP_MONITORING"
    }

    private var intervalMinutes: Int = 30
    private var checkIntervalSeconds: Int = 30
    private var isMonitoring: Boolean = false
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var checkRunnable: Runnable

    private val usageCheckReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                ACTION_CHECK_USAGE -> {
                    checkUsageAndBlock()
                }
                ACTION_STOP_MONITORING -> {
                    stopSelf()
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "UsageMonitoringService created")
        createNotificationChannel()
        setupUsageCheckRunnable()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "UsageMonitoringService started")
        
        intent?.let {
            intervalMinutes = it.getIntExtra("intervalMinutes", 30)
            checkIntervalSeconds = it.getIntExtra("checkIntervalSeconds", 30)
        }

        startForeground(NOTIFICATION_ID, createNotification())
        startMonitoring()
        
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "UsageMonitoringService destroyed")
        stopMonitoring()
        unregisterReceiver(usageCheckReceiver)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun setupUsageCheckRunnable() {
        checkRunnable = object : Runnable {
            override fun run() {
                if (isMonitoring) {
                    checkUsageAndBlock()
                    handler.postDelayed(this, checkIntervalSeconds * 1000L)
                }
            }
        }
    }

    private fun startMonitoring() {
        if (isMonitoring) return
        
        isMonitoring = true
        Log.d(TAG, "Starting usage monitoring with interval: $intervalMinutes minutes, check every: $checkIntervalSeconds seconds")
        
        // Register broadcast receiver
        val filter = IntentFilter().apply {
            addAction(ACTION_CHECK_USAGE)
            addAction(ACTION_STOP_MONITORING)
        }
        registerReceiver(usageCheckReceiver, filter)
        
        // Start periodic checks
        handler.post(checkRunnable)
        
        // Send initial check
        checkUsageAndBlock()
    }

    private fun stopMonitoring() {
        if (!isMonitoring) return
        
        isMonitoring = false
        Log.d(TAG, "Stopping usage monitoring")
        
        handler.removeCallbacks(checkRunnable)
        
        try {
            unregisterReceiver(usageCheckReceiver)
        } catch (e: Exception) {
            Log.e(TAG, "Error unregistering receiver", e)
        }
    }

    private fun checkUsageAndBlock() {
        try {
            val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val startTime = endTime - (intervalMinutes * 60 * 1000L)

            val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            // Calculate total usage time excluding our app
            val totalUsageTime = stats
                .filter { it.packageName != packageName }
                .sumOf { it.totalTimeInForeground }

            val maxAllowedTime = intervalMinutes * 60 * 1000L
            val shouldBlock = totalUsageTime >= maxAllowedTime

            Log.d(TAG, "Usage check: $totalUsageTime ms / $maxAllowedTime ms = ${(totalUsageTime.toDouble() / maxAllowedTime.toDouble()) * 100.0}%")

            if (shouldBlock) {
                Log.d(TAG, "Usage limit exceeded! Triggering block.")
                triggerBlock()
            }

        } catch (e: Exception) {
            Log.e(TAG, "Error checking usage", e)
        }
    }

    private fun triggerBlock() {
        try {
            val timestamp = System.currentTimeMillis()
            
            // Send event to React Native through UsageStats module
            val usageStatsModule = (application as MainApplication).reactInstanceManager.currentReactContext
                ?.getNativeModule(UsageStatsModule::class.java)
            
            usageStatsModule?.sendBlockEvent(timestamp, intervalMinutes)
            
            Log.d(TAG, "Block triggered - event sent to React Native")
            
            // Update notification to show blocking status
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.notify(NOTIFICATION_ID, createBlockingNotification())
            
        } catch (e: Exception) {
            Log.e(TAG, "Error triggering block", e)
            
            // Fallback: send broadcast
            val intent = Intent("com.wordblock.BLOCK_TRIGGERED")
            intent.putExtra("timestamp", System.currentTimeMillis())
            intent.putExtra("intervalMinutes", intervalMinutes)
            sendBroadcast(intent)
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Usage Monitoring",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Monitors device usage for WordBlock app"
                setShowBadge(false)
            }
            
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val stopIntent = Intent(ACTION_STOP_MONITORING)
        val stopPendingIntent = PendingIntent.getBroadcast(
            this, 0, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("WordBlock Active")
            .setContentText("Monitoring device usage (${intervalMinutes}min interval)")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                "Stop",
                stopPendingIntent
            )
        }

        return builder.build()
    }

    private fun createBlockingNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("screen", "block")
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("⚠️ Screen Time Limit Reached")
            .setContentText("Complete learning session to continue")
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)
            .setPriority(Notification.PRIORITY_HIGH)

        return builder.build()
    }
}
