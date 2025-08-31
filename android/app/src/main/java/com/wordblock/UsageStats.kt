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
          val startTime = endTime - 1000 * 60 * 60

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
}