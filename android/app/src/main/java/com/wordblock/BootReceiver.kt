package com.wordblock

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "BootReceiver"
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        Log.d(TAG, "BootReceiver received: ${intent?.action}")
        
        when (intent?.action) {
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED -> {
                Log.d(TAG, "Device boot completed or app updated, checking if monitoring should be restarted")
                
                // In a real implementation, you would check if monitoring was enabled
                // For now, we'll just log that we received the boot event
                // The actual restart logic would be handled by the React Native app
                // when it starts up and checks the stored settings
            }
        }
    }
}
