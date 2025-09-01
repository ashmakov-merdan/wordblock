package com.wordblock

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  companion object {
    private const val TAG = "UsageStatsModule"
    private const val DEFAULT_INTERVAL_MINUTES = 30
  }

  override fun getName(): String {
      return "UsageStats"
  }

  // Helper method to send events to React Native
  private fun sendEvent(eventName: String, params: WritableMap?) {
    try {
      reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    } catch (e: Exception) {
      Log.e(TAG, "Error sending event: $eventName", e)
    }
  }

  @ReactMethod
  fun getUsageStats(promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - 1000 * 60 * 60 // Last hour

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          val result = WritableNativeArray()
          for (usageStat in stats) {
              val map = WritableNativeMap()
              map.putString("packageName", usageStat.packageName)
              map.putDouble("lastTimeUsed", usageStat.lastTimeUsed.toDouble())
              map.putDouble("totalTimeForeground", usageStat.totalTimeInForeground.toDouble())
              result.pushMap(map)
          }

          promise.resolve(result)

      } catch (e: Exception) {
          promise.reject("USAGE_STATS_ERROR", e.message)
      }
  }

  @ReactMethod
  fun getCurrentAppUsage(promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - 1000 * 60 * 60 // Last hour

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          // Find the most recently used app
          val mostRecentApp = stats.maxByOrNull { it.lastTimeUsed }
          
          if (mostRecentApp != null) {
              val result = WritableNativeMap()
              result.putString("packageName", mostRecentApp.packageName)
              result.putDouble("lastTimeUsed", mostRecentApp.lastTimeUsed.toDouble())
              result.putDouble("totalTimeForeground", mostRecentApp.totalTimeInForeground.toDouble())
              result.putBoolean("isCurrentApp", mostRecentApp.packageName == reactApplicationContext.packageName)
              promise.resolve(result)
          } else {
              promise.resolve(null)
          }

      } catch (e: Exception) {
          promise.reject("USAGE_STATS_ERROR", e.message)
      }
  }

  @ReactMethod
  fun getUsageForInterval(intervalMinutes: Int, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - (intervalMinutes * 60 * 1000L)

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          val result = WritableNativeArray()
          for (usageStat in stats) {
              if (usageStat.totalTimeInForeground > 0) {
                  val map = WritableNativeMap()
                  map.putString("packageName", usageStat.packageName)
                  map.putDouble("lastTimeUsed", usageStat.lastTimeUsed.toDouble())
                  map.putDouble("totalTimeForeground", usageStat.totalTimeInForeground.toDouble())
                  map.putDouble("timeInMinutes", usageStat.totalTimeInForeground / (1000.0 * 60.0))
                  result.pushMap(map)
              }
          }

          promise.resolve(result)

      } catch (e: Exception) {
          promise.reject("USAGE_STATS_ERROR", e.message)
      }
  }

  @ReactMethod
  fun isAppInForeground(packageName: String, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - 1000 * 60 * 5 // Last 5 minutes

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          val targetApp = stats.find { it.packageName == packageName }
          val isInForeground = targetApp?.let { 
              it.lastTimeUsed > startTime && it.totalTimeInForeground > 0 
          } ?: false

          promise.resolve(isInForeground)

      } catch (e: Exception) {
          promise.reject("USAGE_STATS_ERROR", e.message)
      }
  }

  @ReactMethod
  fun hasPermission(promise: Promise) {
      val appOps = android.app.AppOpsManager::class.java
      val mode = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as android.app.AppOpsManager
      val info = mode.checkOpNoThrow(
          "android:get_usage_stats",
          android.os.Process.myUid(),
          reactApplicationContext.packageName
      )
      promise.resolve(info == android.app.AppOpsManager.MODE_ALLOWED)
  }

  @ReactMethod
  fun openUsageAccessSettings() {
      val intent = android.content.Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
      intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
      reactApplicationContext.startActivity(intent)
  }

  @ReactMethod
  fun getTopApps(limit: Int, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - 1000 * 60 * 60 * 24 // Last 24 hours

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          val sortedStats = stats
              .filter { it.totalTimeInForeground > 0 }
              .sortedByDescending { it.totalTimeInForeground }
              .take(limit)

          val result = WritableNativeArray()
          for (usageStat in sortedStats) {
              val map = WritableNativeMap()
              map.putString("packageName", usageStat.packageName)
              map.putDouble("totalTimeForeground", usageStat.totalTimeInForeground.toDouble())
              map.putDouble("timeInMinutes", usageStat.totalTimeInForeground / (1000.0 * 60.0))
              map.putDouble("lastTimeUsed", usageStat.lastTimeUsed.toDouble())
              result.pushMap(map)
          }

          promise.resolve(result)

      } catch (e: Exception) {
          promise.reject("USAGE_STATS_ERROR", e.message)
      }
  }

  // New methods for blocking logic
  @ReactMethod
  fun shouldBlockDevice(intervalMinutes: Int, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - (intervalMinutes * 60 * 1000L)

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          // Calculate total usage time excluding our app
          val totalUsageTime = stats
              .filter { it.packageName != reactApplicationContext.packageName }
              .sumOf { it.totalTimeInForeground }

          val maxAllowedTime = intervalMinutes * 60 * 1000L
          val shouldBlock = totalUsageTime >= maxAllowedTime

          val result = WritableNativeMap()
          result.putBoolean("shouldBlock", shouldBlock)
          result.putDouble("totalUsageTime", totalUsageTime.toDouble())
          result.putDouble("maxAllowedTime", maxAllowedTime.toDouble())
          result.putDouble("usagePercentage", (totalUsageTime.toDouble() / maxAllowedTime.toDouble()) * 100.0)

          Log.d(TAG, "Usage check: $totalUsageTime ms / $maxAllowedTime ms = ${(totalUsageTime.toDouble() / maxAllowedTime.toDouble()) * 100.0}%")

          promise.resolve(result)

      } catch (e: Exception) {
          Log.e(TAG, "Error checking if should block device", e)
          promise.reject("BLOCKING_ERROR", e.message)
      }
  }

  @ReactMethod
  fun getCurrentUsageTime(intervalMinutes: Int, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - (intervalMinutes * 60 * 1000L)

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          // Calculate total usage time excluding our app
          val totalUsageTime = stats
              .filter { it.packageName != reactApplicationContext.packageName }
              .sumOf { it.totalTimeInForeground }

          val result = WritableNativeMap()
          result.putDouble("totalUsageTime", totalUsageTime.toDouble())
          result.putDouble("usageTimeMinutes", totalUsageTime / (1000.0 * 60.0))
          result.putDouble("intervalMinutes", intervalMinutes.toDouble())
          result.putDouble("remainingMinutes", intervalMinutes - (totalUsageTime / (1000.0 * 60.0)))

          promise.resolve(result)

      } catch (e: Exception) {
          Log.e(TAG, "Error getting current usage time", e)
          promise.reject("USAGE_TIME_ERROR", e.message)
      }
  }

  @ReactMethod
  fun getDetailedUsageBreakdown(intervalMinutes: Int, promise: Promise) {
      try {
          val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
          val endTime = System.currentTimeMillis()
          val startTime = endTime - (intervalMinutes * 60 * 1000L)

          val stats: List<UsageStats> = usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_DAILY,
              startTime,
              endTime
          )

          val breakdown = WritableNativeArray()
          val totalUsageTime = stats
              .filter { it.packageName != reactApplicationContext.packageName && it.totalTimeInForeground > 0 }
              .sortedByDescending { it.totalTimeInForeground }

          for (usageStat in totalUsageTime) {
              val appInfo = WritableNativeMap()
              appInfo.putString("packageName", usageStat.packageName)
              appInfo.putDouble("totalTimeForeground", usageStat.totalTimeInForeground.toDouble())
              appInfo.putDouble("timeInMinutes", usageStat.totalTimeInForeground / (1000.0 * 60.0))
              appInfo.putDouble("lastTimeUsed", usageStat.lastTimeUsed.toDouble())
              breakdown.pushMap(appInfo)
          }

          val result = WritableNativeMap()
          result.putArray("apps", breakdown)
          result.putDouble("totalUsageTime", totalUsageTime.sumOf { it.totalTimeInForeground }.toDouble())
          result.putDouble("totalUsageMinutes", totalUsageTime.sumOf { it.totalTimeInForeground } / (1000.0 * 60.0))

          promise.resolve(result)

      } catch (e: Exception) {
          Log.e(TAG, "Error getting detailed usage breakdown", e)
          promise.reject("BREAKDOWN_ERROR", e.message)
      }
  }

  // Background monitoring methods
  @ReactMethod
  fun startBackgroundMonitoring(intervalMinutes: Int, checkIntervalSeconds: Int, promise: Promise) {
      try {
          Log.d(TAG, "Starting background monitoring with interval: $intervalMinutes minutes, check every: $checkIntervalSeconds seconds")
          
          // Start the background service
          val intent = android.content.Intent(reactApplicationContext, UsageMonitoringService::class.java)
          intent.putExtra("intervalMinutes", intervalMinutes)
          intent.putExtra("checkIntervalSeconds", checkIntervalSeconds)
          
          reactApplicationContext.startService(intent)
          
          promise.resolve(true)
      } catch (e: Exception) {
          Log.e(TAG, "Error starting background monitoring", e)
          promise.reject("MONITORING_ERROR", e.message)
      }
  }

  @ReactMethod
  fun stopBackgroundMonitoring(promise: Promise) {
      try {
          Log.d(TAG, "Stopping background monitoring")
          
          val intent = android.content.Intent(reactApplicationContext, UsageMonitoringService::class.java)
          reactApplicationContext.stopService(intent)
          
          promise.resolve(true)
      } catch (e: Exception) {
          Log.e(TAG, "Error stopping background monitoring", e)
          promise.reject("MONITORING_ERROR", e.message)
      }
  }

  @ReactMethod
  fun isBackgroundMonitoringActive(promise: Promise) {
      try {
          val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
          val runningServices = activityManager.getRunningServices(Integer.MAX_VALUE)
          
          val isActive = runningServices.any { it.service.className == "com.wordblock.UsageMonitoringService" }
          promise.resolve(isActive)
      } catch (e: Exception) {
          Log.e(TAG, "Error checking background monitoring status", e)
          promise.resolve(false)
      }
  }

  // Method to send block event to React Native (called by the service)
  fun sendBlockEvent(timestamp: Long, intervalMinutes: Int) {
      val params = WritableNativeMap()
      params.putDouble("timestamp", timestamp.toDouble())
      params.putDouble("intervalMinutes", intervalMinutes.toDouble())
      
      sendEvent("blockTriggered", params)
      Log.d(TAG, "Block event sent to React Native: timestamp=$timestamp, interval=$intervalMinutes")
  }
}