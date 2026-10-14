package org.secureher.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.telephony.SmsManager;
import android.telephony.TelephonyManager;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import java.util.ArrayList;

@CapacitorPlugin(
    name = "DirectSms",
    permissions = {
        @Permission(
            alias = "sms",
            strings = { Manifest.permission.SEND_SMS, Manifest.permission.READ_PHONE_STATE }
        )
    }
)
public class DirectSmsPlugin extends Plugin {

    @PluginMethod
    public void canSendSms(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            Context context = getContext();
            TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            boolean hasSim = tm != null && tm.getSimState() == TelephonyManager.SIM_STATE_READY;
            boolean hasPermission = ActivityCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED;
            
            ret.put("supported", true);
            ret.put("hasSim", hasSim);
            ret.put("hasPermission", hasPermission);
            call.resolve(ret);
        } catch (Exception e) {
            ret.put("supported", false);
            ret.put("hasSim", false);
            ret.put("hasPermission", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void sendSms(PluginCall call) {
        String phoneNumber = call.getString("phoneNumber");
        String message = call.getString("message");

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            call.reject("Recipient phone number is required");
            return;
        }

        if (message == null || message.trim().isEmpty()) {
            call.reject("SMS message content cannot be empty");
            return;
        }

        Context context = getContext();
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) {
            call.reject("SEND_SMS permission not granted");
            return;
        }

        try {
            TelephonyManager tm = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            if (tm != null && tm.getSimState() != TelephonyManager.SIM_STATE_READY) {
                JSObject errorRet = new JSObject();
                errorRet.put("sent", false);
                errorRet.put("reason", "no_sim");
                errorRet.put("message", "No active SIM card detected on this device.");
                call.reject("No active SIM card detected", "NO_SIM", errorRet);
                return;
            }

            SmsManager smsManager;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                smsManager = context.getSystemService(SmsManager.class);
            } else {
                smsManager = SmsManager.getDefault();
            }

            if (smsManager == null) {
                call.reject("SmsManager is unavailable on this device");
                return;
            }

            ArrayList<String> parts = smsManager.divideMessage(message);
            if (parts.size() > 1) {
                smsManager.sendMultipartTextMessage(phoneNumber, null, parts, null, null);
            } else {
                smsManager.sendTextMessage(phoneNumber, null, message, null, null);
            }

            JSObject ret = new JSObject();
            ret.put("sent", true);
            ret.put("status", "dispatched_to_carrier");
            ret.put("recipient", phoneNumber);
            ret.put("partsCount", parts.size());
            ret.put("message", "Direct SMS handed over to cellular carrier radio.");
            call.resolve(ret);
        } catch (SecurityException secEx) {
            call.reject("Permission revoked or denied by system security policy", secEx);
        } catch (Exception ex) {
            call.reject("Failed to dispatch SMS: " + ex.getMessage(), ex);
        }
    }

    @PluginMethod
    public void openSmsApp(PluginCall call) {
        String phoneNumber = call.getString("phoneNumber");
        String message = call.getString("message");

        try {
            Uri uri = Uri.parse("smsto:" + (phoneNumber != null ? Uri.encode(phoneNumber) : ""));
            Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
            if (message != null) {
                intent.putExtra("sms_body", message);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);

            JSObject ret = new JSObject();
            ret.put("opened", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Unable to open native SMS composer: " + e.getMessage(), e);
        }
    }
}
