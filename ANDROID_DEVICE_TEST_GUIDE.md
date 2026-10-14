# SecureHer — Real-Device Testing & Android Readiness Guide

This guide provides step-by-step instructions for building, installing, and rigorously verifying Native SMS and Firebase Cloud Messaging (FCM) push alerts on physical Android devices.

---

## 1. Prerequisites Checklist

Before building the native Android APK, verify that your environment has:
- [ ] **Windows 10 / 11** (64-bit)
- [ ] **JDK 17 or JDK 21** installed (e.g. Eclipse Adoptium Temurin 17) with `JAVA_HOME` pointing to the JDK folder and `%JAVA_HOME%\bin` in `PATH`.
- [ ] **Android Studio** (Hedgehog 2023.1.1 or Ladybug 2024.2.1+) with:
  - Android SDK Platform 34 (Android 14)
  - Android SDK Build-Tools 34.0.0
  - Android SDK Command-line Tools (latest)
  - Environment variable `ANDROID_HOME` pointing to `%LOCALAPPDATA%\Android\Sdk`
- [ ] **Google Services Configuration:** `google-services.json` placed inside `android/app/` (downloaded directly from Firebase Console for package `org.secureher.app`).
- [ ] **Physical Android Device:**
  - Active SIM card with SMS sending enabled.
  - USB Debugging enabled in *Developer Options*.
  - Connected via USB and authorized (`adb devices` shows `device`).

---

## 2. Setting Up JDK and Android Studio (Safe Instructions)

If JDK 17+ or Android Studio are missing on your Windows machine, install them safely using official Microsoft Winget packages:

### Step 2.1: Install JDK 17 (Temurin)
Run in Administrator PowerShell:
```powershell
winget install EclipseAdoptium.Temurin.17.JDK --accept-package-agreements --accept-source-agreements
```
Then verify:
```powershell
java -version
```

### Step 2.2: Install Android Studio
Run in PowerShell:
```powershell
winget install Google.AndroidStudio --accept-package-agreements --accept-source-agreements
```
Open Android Studio, complete the setup wizard (Standard installation), and ensure Android SDK 34 is installed via **Tools -> SDK Manager**.

Set environment variables:
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
[System.Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$env:LOCALAPPDATA\Android\Sdk\platform-tools", "User")
```

---

## 3. Configuring Firebase Android App

1. Go to the [Firebase Console](https://console.firebase.google.com/) for project `her-a955f`.
2. Click **Add App** -> **Android**.
3. Enter Android package name: `org.secureher.app` (must match `capacitor.config.json` and `android/app/build.gradle`).
4. Download the generated `google-services.json`.
5. Place the downloaded file into `D:\Project\SecureHer\android\app\google-services.json`.
   > **Security Warning:** Do NOT commit `google-services.json` to public Git repositories. It is tracked in `.gitignore`.

---

## 4. Building and Installing the APK

Once JDK and Android SDK are installed and your device is connected via USB:

### Step 4.1: Build Web Assets and Sync Capacitor
```powershell
cd D:\Project\SecureHer
npm run build
npx cap sync android
```

### Step 4.2: Build the Debug APK
```powershell
cd android
.\gradlew.bat assembleDebug
```
The compiled APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4.3: Install onto Physical Device
```powershell
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```
*(Or open the `android` folder in Android Studio and click the green "Run" button with your device selected).*

---

## 5. End-to-End Real Device Verification Checklist

Perform these tests on a physical Android device with a consenting recipient.

### Test A: Sign-In and Token Registration
1. Launch **SecureHer** on the Android device.
2. Sign in with a test Google or email account (e.g. `tester-sender@secureher.test`).
3. Verify that the app prompts for Notification permission on Android 13+. Tap **Allow**.
4. Check the Firestore Database under `users/{senderUid}/devices`:
   - A document should be created storing `token` and `platform: "android"`.

### Test B: Configure Emergency Circle
1. Navigate to **Emergency Contacts** in the app drawer.
2. Add a trusted contact:
   - **Name:** Consenting Recipient Name
   - **Phone:** Recipient's real mobile number (format: `+91XXXXXXXXXX` or `+1XXXXXXXXXX`)
   - **Relationship:** Family / Trusted Friend
3. Verify the contact appears in the list as primary emergency contact.

### Test C: Recipient Device Setup (For Push Alerts)
1. On a **second test device** (or secondary browser), sign in with the trusted contact's account.
2. Grant notification permissions to register the contact's FCM device token under `users/{recipientUid}/devices`.

---

## 6. Execution of SOS Emergency Trigger Flow

### Test D: Native Direct SMS Dispatch (Happy Path)
1. Ensure the sender device has cellular signal and an active SIM.
2. Navigate to the **SOS Emergency** page.
3. Tap the red **Activate Emergency SOS** button.
4. On the first run, Android displays the runtime permission modal: *"Allow SecureHer to send SMS messages?"*. Tap **Allow**.
5. Observe the UI:
   - A 5-second countdown initiates (or instant trigger).
   - Event status changes to **Dispatched**.
   - SMS status displays: `dispatched_to_carrier` with the recipient's phone number.
   - GPS coordinates and Google Maps link are displayed.
6. Verify on the recipient's physical phone:
   - Recipient receives an SMS:
     `"EMERGENCY! [Sender Name] needs help. Please contact immediately. Location (±Xm): https://maps.google.com/?q=..."`
7. Check carrier delivery receipt / logs.

### Test E: FCM Push Notification Dispatch
1. Simultaneously with SMS dispatch, check the recipient's second device.
2. A high-priority emergency notification should appear:
   - **Title:** `🚨 EMERGENCY SOS — [Sender Name] Needs Help!`
   - **Body:** `[Sender Name] activated emergency SOS! Location: ...`
   - **Sound:** Emergency audible chime / alert sound.
3. Tapping the push notification opens the SecureHer app directly to the emergency tracking view.

### Test F: Self-Notification Exclusion Verification
1. Inspect the sender's own device notifications.
2. **Verify:** The sender's device must **NOT** receive its own emergency alert notification.
3. Check FastAPI backend console:
   - Confirm log line: `sender_uid` was excluded from recipient list.

---

## 7. Negative & Edge-Case Verification

| Test Scenario | Action / Condition | Expected Behavior |
| :--- | :--- | :--- |
| **No SIM Card** | Remove SIM or enable Airplane Mode (with WiFi on). Trigger SOS. | Direct SMS fails gracefully with `no_sim`. App displays transparent prompt: *"No active SIM card detected. Please call 112 directly."* Push notification still dispatches over WiFi. |
| **SMS Permission Denied** | In Android Settings, revoke SMS permission for SecureHer. Trigger SOS. | App reports `permission_denied`. Fallback button *"Open SMS Composer"* opens native Android Messages with prepopulated body. |
| **Notification Permission Denied** | In Android Settings, revoke Notifications. | App functions without crash; warning banner informs user that background push alerts cannot be received. |
| **GPS Unavailable** | Disable Device Location / GPS in Android Quick Settings. Trigger SOS. | App records `locationStatus: "unavailable"`. SMS and Push message explicitly state: `"(GPS coordinates unavailable at trigger)"`. No coordinates are invented or defaulted. |
| **Stale GPS Fix** | Simulate GPS signal loss after movement. Trigger SOS. | Message body appends `[Stale Fix]` and GPS age so responders know coordinates are not current. |
| **Invalid / Expired FCM Token** | Simulate an uninstalled app or invalid token. | Multicast response identifies `registration-token-not-registered`. Backend automatically purges stale token from Firestore `users/{uid}/devices` without crashing. |
| **Backend Unreachable** | Stop FastAPI server (`Ctrl+C`). Trigger SOS. | App catches network timeout, reports `pushStatus: "unreachable"`, while native Direct SMS continues independently through the cellular SIM. |

---

## 8. Backend Verification & Log Auditing

To observe backend behavior during real-device testing without exposing credentials:

1. Start the FastAPI backend:
   ```powershell
   cd D:\Project\SecureHer\backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. Trigger the SOS alert from the mobile device.
3. Inspect terminal output:
   - Look for structured lines:
     `[INFO] secureher.backend: Received SOS push alert dispatch request`
     `[INFO] secureher.backend: FCM push result: X sent, Y failed out of Z tokens`
   - Verify that bearer tokens and service account secrets are NEVER logged.

---

## 9. Delivery Evidence Rule

> **CRITICAL VERIFICATION PRINCIPLE:**
> 1. In native SMS, the OS call returns `dispatched_to_carrier`. This confirms the message was handed to the cellular radio, **NOT** that the recipient's phone has received it.
> 2. Never mark physical SMS as *delivered* without an actual carrier delivery receipt or confirmation on the recipient's physical handset.
> 3. Never mark FCM push as *delivered* without visual confirmation on the recipient's lock screen or foreground notification handler.
