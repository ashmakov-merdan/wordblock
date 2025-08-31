package com.wordblock

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.provider.Settings
import android.util.Log
import com.facebook.react.bridge.*
import java.util.*

class UsageStatsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
      return "UsageStats"
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
}