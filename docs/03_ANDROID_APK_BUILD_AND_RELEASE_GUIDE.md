# CareContinuum - Android APK Build & Deployment Guide

This guide explains how to package and compile the CareContinuum codebase into an installable Android Application Package (`.apk`) file.

---

## Method 1: Build via Capacitor (Recommended & Fastest)

Capacitor creates a native Android Studio project directly wrapping the production build.

### Prerequisites:
- Node.js 18+ and npm
- Android Studio (Electric Eel or newer)
- Android SDK Platform 34 and Command-line Tools

### Step-by-Step Commands:

```bash
# 1. Build the production web bundle
npm run build

# 2. Install Capacitor core and CLI
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# 3. Initialize Capacitor with the app ID and name
npx cap init "CareContinuum" "com.carecontinuum.app" --web-dir "dist"

# 4. Add the Android native platform
npx cap add android

# 5. Copy built assets into Android assets folder
npx cap sync android

# 6. Open the Android project in Android Studio
npx cap open android
```

### In Android Studio:
1. Wait for Gradle sync to finish.
2. In the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Once compilation finishes, click **Locate** on the popup.
4. Your installable APK is located at:
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Transfer this `.apk` to any Android phone via USB, Google Drive, or Bluetooth and tap it to install!

---

## Method 2: Build via Google Bubblewrap (Trusted Web Activity - TWA)

Google's official CLI tool packages modern web apps into verified Google Play Store ready APKs.

```bash
# 1. Install Google Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize from the hosted manifest
bubblewrap init --manifest https://YOUR_APP_URL/manifest.json

# 3. Build signed APK
bubblewrap build
```

Output:
```
./app-release-signed.apk
```

---

## Method 3: Direct Progressive Web App (PWA) Install on Android (Zero Compilation)
For testing on any Android phone without needing Android Studio installed:
1. Open the hosted URL in **Google Chrome for Android**.
2. Tap the three dots menu (⋮) in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. CareContinuum installs as a standalone native app icon with full screen immersion, hardware camera access, and offline SQLite/IndexedDB persistence.

---

## Android Manifest Permissions Configured

In `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.carecontinuum.app">

    <!-- Camera Access for Barcode and OCR Scanning -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- Bluetooth LE for CareContinuum Smart Medicine Box Pairing -->
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />

    <!-- Notifications and Daily Medication Reminders -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="CareContinuum"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
    </application>
</manifest>
```
