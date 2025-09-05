package com.wordblock

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import android.app.ActivityManager

class UsageStatsModule(private val reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "UsageStatsModule"

  // 1. Check if permission is granted
  @ReactMethod
  fun hasUsagePermission(promise: Promise) {
    try {
      val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      val mode =
              if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                        AppOpsManager.OPSTR_GET_USAGE_STATS,
                        android.os.Process.myUid(),
                        reactContext.packageName
                )
              } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                        AppOpsManager.OPSTR_GET_USAGE_STATS,
                        android.os.Process.myUid(),
                        reactContext.packageName
                )
              }
      promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
    } catch (e: Exception) {
      promise.reject("PERMISSION_ERROR", e.message, e)
    }
  }

  // 2. Open "Usage Access" settings screen
  @ReactMethod
  fun openUsageAccessSettings(promise: Promise) {
    try {
      val intent =
              Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
              }
      reactContext.startActivity(intent)
      promise.resolve(null)
    } catch (e: ActivityNotFoundException) {
      try {
        val fallback =
                Intent(Settings.ACTION_SETTINGS).apply { addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) }
        reactContext.startActivity(fallback)
        promise.resolve(null)
      } catch (e2: Exception) {
        promise.reject("OPEN_SETTINGS_ERROR", e2.message, e2)
      }
    }
  }

  @ReactMethod
  fun getAppUsage(promise: Promise) {
    try {
      val usm = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val now = System.currentTimeMillis()

      val stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_BEST, 0, now)

      val myStats = stats.find { it.packageName == reactContext.packageName }

      if (myStats != null) {
        val map = Arguments.createMap()
        map.putString("packageName", myStats.packageName)
        map.putDouble("totalTimeInForeground", myStats.totalTimeInForeground.toDouble())
        map.putDouble("firstTimeStamp", myStats.firstTimeStamp.toDouble())
        map.putDouble("lastTimeStamp", myStats.lastTimeStamp.toDouble())
        map.putDouble("lastTimeUsed", myStats.lastTimeUsed.toDouble())
        promise.resolve(map)
      } else {
        promise.resolve(null)
      }
    } catch (e: Exception) {
      promise.reject("TOTAL_USAGE_ERROR", e.message, e)
    }
  }

  // 4. Query raw usage events
  @ReactMethod
  fun getUsageEvents(startTime: Double, endTime: Double, promise: Promise) {
    try {
      val usm = reactContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val events = usm.queryEvents(startTime.toLong(), endTime.toLong())

      val result = Arguments.createArray()
      val event = UsageEvents.Event()
      while (events.hasNextEvent()) {
        events.getNextEvent(event)
        val map = Arguments.createMap()
        map.putString("packageName", event.packageName)
        map.putInt("eventType", event.eventType)
        map.putDouble("timeStamp", event.timeStamp.toDouble())
        if (event.className != null) map.putString("className", event.className)
        result.pushMap(map)
      }
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("USAGE_EVENTS_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun setBlocking(enabled: Boolean, promise: Promise) {
    try {
      val activity = reactApplicationContext.currentActivity

      if (activity != null) {
        if (enabled) {
          activity.startLockTask() // Blocks navigation & switching apps
        } else {
          activity.stopLockTask()
        }
        promise.resolve(null)
      } else {
        promise.reject("NO_ACTIVITY", "No current activity found")
      }
    } catch (e: Exception) {
      promise.reject("BLOCK_ERROR", e.message, e)
    }
  }

  @ReactMethod
  fun isPinned(promise: Promise) {
    try {
      val activityManager =
              reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val isPinned = activityManager.lockTaskModeState == ActivityManager.LOCK_TASK_MODE_LOCKED
      promise.resolve(isPinned)
    } catch (e: Exception) {
      promise.reject("CHECK_PINNED_ERROR", e.message, e)
    }
  }
}
