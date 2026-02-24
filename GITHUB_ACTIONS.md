# GitHub Actions Setup Guide

## 🚀 Building Your Android App on GitHub Actions

This guide shows you how to set up automated builds using GitHub Actions.

## 📁 What's Included

Two workflow files have been added to `.github/workflows/`:

1. **android-build.yml** - Builds APK on every push/PR
2. **android-release.yml** - Builds signed APK for releases

## 🔧 Quick Setup

### Step 1: Push to GitHub

```bash
# Initialize git repository
cd RunAutomation
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Run-automation app"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### Step 2: Automatic Build

Once pushed, GitHub Actions will automatically:
- ✅ Build Debug APK on every push
- ✅ Build Release APK (unsigned)
- ✅ Upload APKs as artifacts

### Step 3: Download Built APK

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the latest workflow run
4. Scroll down to **Artifacts** section
5. Download `app-debug.apk` or `app-release-unsigned.apk`

## 🔐 For Signed Release Builds

If you want signed APKs (required for Play Store), follow these steps:

### 1. Generate a Keystore (if you don't have one)

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

You'll be asked:
- Keystore password (remember this!)
- Key password (remember this!)
- Your name, organization, etc.

### 2. Convert Keystore to Base64

```bash
# On Linux/Mac
base64 my-release-key.jks > keystore-base64.txt

# On Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("my-release-key.jks")) > keystore-base64.txt
```

### 3. Add GitHub Secrets

Go to your GitHub repository:
1. Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `KEYSTORE_BASE64` | Contents of `keystore-base64.txt` | Base64-encoded keystore |
| `KEYSTORE_PASSWORD` | Your keystore password | Password you set earlier |
| `KEY_ALIAS` | `my-key-alias` | Alias you used |
| `KEY_PASSWORD` | Your key password | Key password you set |

### 4. Update build.gradle for Signing

Add this to `app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_PATH") != null) {
                storeFile file(System.getenv("KEYSTORE_PATH"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 5. Create a Release

```bash
# Tag a release
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

GitHub Actions will:
- Build signed APK
- Create a GitHub Release
- Attach the APK to the release

## 📊 Workflow Status Badge

Add this to your README.md to show build status:

```markdown
![Android Build](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Android%20Build/badge.svg)
```

## 🔍 Viewing Build Logs

1. Go to **Actions** tab on GitHub
2. Click on any workflow run
3. Click on the "build" job
4. Expand steps to see detailed logs

## ⚡ Workflow Triggers

### android-build.yml triggers on:
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main` or `master`
- Manual trigger (workflow_dispatch)

### android-release.yml triggers on:
- Git tags starting with `v` (e.g., v1.0.0)
- Manual trigger

## 🛠️ Manual Trigger

To manually trigger a build:
1. Go to **Actions** tab
2. Select the workflow
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow** button

## 📱 Testing the APK

After downloading from GitHub Actions:

### Install on Android Device

```bash
# Via ADB
adb install app-debug.apk

# Or transfer to phone and install directly
```

### On Physical Device
1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Transfer APK to device
4. Install (you may need to enable "Install from Unknown Sources")

## 🐛 Troubleshooting

### Build Fails - Chaquopy Download

**Problem**: Chaquopy files fail to download

**Solution**: GitHub Actions has good network, but if it fails:
```yaml
# Add retry logic in workflow
- name: Build with retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 30
    max_attempts: 3
    command: ./gradlew assembleDebug
```

### Build Fails - Out of Memory

**Problem**: Gradle runs out of memory

**Solution**: Update `gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8
```

### Signed Build Fails

**Problem**: Keystore not found or wrong password

**Solutions**:
1. Check that `KEYSTORE_BASE64` secret is set correctly
2. Verify passwords match what you used to create keystore
3. Check the "Decode Keystore" step in workflow logs

### Build Takes Too Long

**Problem**: Build times out (>60 minutes)

**Solution**: Enable Gradle caching (already added):
```yaml
- name: Cache Gradle packages
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
```

## 📈 Advanced: Build Matrix

To build for multiple configurations:

```yaml
strategy:
  matrix:
    include:
      - buildType: debug
      - buildType: release

steps:
  - name: Build ${{ matrix.buildType }} APK
    run: ./gradlew assemble${{ matrix.buildType }}
```

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Verify build succeeds
3. ✅ Download and test APK
4. ⏳ Add signing for releases
5. ⏳ Create releases with tags
6. ⏳ Set up Play Store deployment (optional)

## 🔗 Useful Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Android Gradle Plugin](https://developer.android.com/studio/releases/gradle-plugin)
- [Chaquopy Documentation](https://chaquo.com/chaquopy/)

## 💡 Tips

1. **Free GitHub Actions minutes**: Public repos get unlimited minutes
2. **Private repos**: 2000 minutes/month on free plan
3. **Build time**: First build ~10-15 minutes, cached builds ~3-5 minutes
4. **Artifacts expire**: Downloaded APKs are deleted after 90 days
5. **Security**: Never commit keystores or passwords to git!

---

**Happy building! 🚀**
