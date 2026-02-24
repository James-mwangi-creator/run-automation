# Run-automation Android App

A modern Android app for running Python automation scripts with a beautiful WebView interface.

## 🎯 Features

- **Beautiful UI**: Dark/Light theme support with gradient backgrounds matching your logo
- **Authentication**: Login/Register system for users
- **My Scripts**: View and run purchased automation scripts
- **Marketplace**: Browse and purchase new automation scripts
- **Script Runner**: Execute Python scripts with custom input and view output
- **Cloud Sync**: Optional cloud backup for scripts (backend integration required)
- **Settings**: Theme switching, profile management, and more

## 🏗️ Architecture

```
User Interface (WebView - HTML/CSS/JS)
           ↕
JavaScript Bridge (Android Interface)
           ↕
Kotlin/Android App Layer
           ↕
Chaquopy (Python Runtime)
           ↕
Python Scripts (Encrypted in Internal Storage)
```

## 📁 Project Structure

```
RunAutomation/
├── app/
│   ├── src/main/
│   │   ├── java/com/runautomation/app/
│   │   │   ├── MainActivity.kt          # Main activity with WebView
│   │   │   └── SplashActivity.kt        # Splash screen
│   │   ├── res/
│   │   │   ├── layout/                  # XML layouts
│   │   │   ├── values/                  # Colors, themes, strings
│   │   │   └── drawable/                # Graphics
│   │   ├── assets/webview/
│   │   │   ├── index.html              # Main WebView UI
│   │   │   ├── styles.css              # Styling with logo colors
│   │   │   └── app.js                  # App logic and Android bridge
│   │   └── AndroidManifest.xml
│   └── build.gradle                     # App dependencies
├── build.gradle                         # Project config
└── sample_scripts/
    └── sample_automation.py             # Example Python script
```

## 🚀 Setup Instructions

### Prerequisites

1. **Android Studio** (Latest version recommended)
2. **JDK 17** or higher
3. **Android SDK** with minimum SDK 24 (Android 7.0)

### Installation Steps

1. **Open Project in Android Studio**
   - File → Open → Select the `RunAutomation` folder

2. **Sync Gradle**
   - Android Studio will automatically start syncing
   - Wait for all dependencies to download (including Chaquopy)

3. **Add Your Logo**
   - Replace the default launcher icons in `app/src/main/res/mipmap-*/`
   - Use your uploaded logo image
   - Or use Android Studio's Image Asset tool:
     - Right-click `res` → New → Image Asset
     - Select your logo file
     - Generate all sizes

4. **Run the App**
   - Connect an Android device or start an emulator
   - Click Run (green play button)
   - The app will install and launch

## 🎨 Customization

### Colors (Based on Your Logo)

The app uses these colors from your logo (defined in `colors.xml`):
- Primary Dark Blue: `#0A1628`
- Primary Blue: `#1E3A8A`
- Accent Cyan: `#06B6D4`
- Accent Purple: `#A855F7`
- Accent Light Blue: `#3B82F6`

### Adding Python Scripts

Scripts are stored in the app's internal storage at:
```
/data/data/com.runautomation.app/files/scripts/
```

Each script must have a `run_automation(input_data)` function:

```python
def run_automation(input_data):
    # Your automation logic here
    result = "Processing complete!"
    return result
```

## 📱 How It Works

### 1. User Flow

1. **Launch**: Splash screen with your logo
2. **Auth**: Login or register
3. **Profile Tab**: View and run owned scripts
4. **Marketplace Tab**: Browse and purchase new scripts
5. **Settings Tab**: Customize appearance and manage account

### 2. Script Execution

```javascript
// JavaScript calls Android
Android.runPythonScript(scriptName, inputData)

↓

// Kotlin executes Python via Chaquopy
python.getModule("__main__").callAttr("run_automation", inputData)

↓

// Python script processes and returns result
return "Result: Success!"

↓

// Result shown in WebView UI
```

### 3. Data Storage

- **User Data**: SharedPreferences (can be encrypted)
- **Scripts**: Internal storage (`/files/scripts/`)
- **Theme**: Saved in SharedPreferences

## 🔐 Security Features

1. **App-Only Storage**: Scripts stored in internal storage, inaccessible to other apps
2. **Encrypted Storage**: Can implement AES encryption for script files
3. **Sandboxing**: Android's app sandbox protects data
4. **No Root Required**: Everything works on non-rooted devices

## 🛠️ Backend Integration (TODO)

To connect to your Django backend:

1. **Update API Endpoints** in `app.js`:
```javascript
const API_BASE_URL = 'https://your-backend.com/api';
```

2. **Implement Authentication**:
   - Send login/register requests to backend
   - Store JWT tokens
   - Validate purchases with Google Play Billing

3. **Script Downloads**:
   - Fetch purchased scripts from backend
   - Implement encryption for downloads
   - Verify purchase status

4. **Cloud Sync**:
   - Upload/download script configurations
   - Sync user settings across devices

## 📦 Dependencies

- **Chaquopy 15.0.1**: Python runtime for Android
- **AndroidX**: Modern Android components
- **Material Components**: UI components
- **Gson**: JSON parsing
- **Security Crypto**: For encrypted storage

## 🐛 Troubleshooting

### Chaquopy Build Issues
- Ensure you have a stable internet connection for first build
- Check that all repositories are accessible
- Try: Build → Clean Project → Rebuild Project

### WebView Not Loading
- Check that `index.html` is in `assets/webview/`
- Verify JavaScript is enabled in WebView settings
- Check Logcat for errors

### Python Script Errors
- Ensure script has `run_automation()` function
- Check script syntax with Python 3
- View errors in script output area

## 📄 License

This is a template project. Add your own license as needed.

## 🤝 Contributing

This is your project! Customize it however you want.

## 📞 Support

For questions about:
- **Android Development**: Check Android documentation
- **Chaquopy**: Visit https://chaquo.com/chaquopy/
- **Python**: Python.org documentation

## 🎯 Next Steps

1. ✅ Basic app structure (COMPLETE)
2. ✅ WebView UI (COMPLETE)
3. ✅ Python integration (COMPLETE)
4. ⏳ Connect to Django backend
5. ⏳ Implement Google Play Billing
6. ⏳ Add real automation scripts
7. ⏳ Publish to Play Store

## 🌟 Features to Add

- [ ] Real user authentication with backend
- [ ] Google Play In-App Purchases
- [ ] Script encryption/decryption
- [ ] Cloud backup implementation
- [ ] Script update notifications
- [ ] User reviews and ratings
- [ ] Script categories and filtering
- [ ] Search functionality
- [ ] Analytics integration
- [ ] Push notifications

---

**Built with ❤️ for Run-automation**
