package com.runautomation.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import com.google.gson.Gson
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var python: Python

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Python
        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }
        python = Python.getInstance()

        // Setup WebView
        webView = findViewById(R.id.webView)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
        }

        // Add JavaScript interface for communication
        webView.addJavascriptInterface(WebAppInterface(), "Android")
        
        webView.webViewClient = WebViewClient()

        // Load the web app
        webView.loadUrl("file:///android_asset/webview/index.html")
    }

    inner class WebAppInterface {
        
        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun runPythonScript(scriptName: String, inputData: String): String {
            return try {
                // Get the script file from internal storage
                val scriptsDir = File(filesDir, "scripts")
                val scriptFile = File(scriptsDir, "$scriptName.py")

                if (!scriptFile.exists()) {
                    return createErrorResponse("Script not found")
                }

                // Read and execute the Python script
                val scriptContent = scriptFile.readText()
                val module = python.getModule("__main__")
                
                // Execute script (in real implementation, you'd pass inputData)
                module.callAttr("exec", scriptContent)
                
                // Call the main function if it exists
                val result = if (module.containsKey("run_automation")) {
                    module.callAttr("run_automation", inputData).toString()
                } else {
                    "Script executed successfully"
                }

                createSuccessResponse(result)
            } catch (e: Exception) {
                createErrorResponse(e.message ?: "Unknown error")
            }
        }

        @JavascriptInterface
        fun getUserScripts(): String {
            return try {
                val scriptsDir = File(filesDir, "scripts")
                if (!scriptsDir.exists()) {
                    scriptsDir.mkdirs()
                }

                val scripts = scriptsDir.listFiles()?.filter { it.extension == "py" }
                    ?.map { it.nameWithoutExtension } ?: emptyList()

                Gson().toJson(mapOf("scripts" to scripts))
            } catch (e: Exception) {
                createErrorResponse(e.message ?: "Failed to load scripts")
            }
        }

        @JavascriptInterface
        fun saveUserData(key: String, value: String): String {
            return try {
                val prefs = getSharedPreferences("user_data", MODE_PRIVATE)
                prefs.edit().putString(key, value).apply()
                createSuccessResponse("Data saved")
            } catch (e: Exception) {
                createErrorResponse(e.message ?: "Failed to save data")
            }
        }

        @JavascriptInterface
        fun getUserData(key: String): String {
            return try {
                val prefs = getSharedPreferences("user_data", MODE_PRIVATE)
                val value = prefs.getString(key, null)
                if (value != null) {
                    Gson().toJson(mapOf("value" to value))
                } else {
                    createErrorResponse("Key not found")
                }
            } catch (e: Exception) {
                createErrorResponse(e.message ?: "Failed to load data")
            }
        }

        @JavascriptInterface
        fun downloadScript(scriptId: String, scriptContent: String, scriptName: String): String {
            return try {
                // Save script to encrypted internal storage
                val scriptsDir = File(filesDir, "scripts")
                if (!scriptsDir.exists()) {
                    scriptsDir.mkdirs()
                }

                val scriptFile = File(scriptsDir, "$scriptName.py")
                scriptFile.writeText(scriptContent)

                createSuccessResponse("Script downloaded successfully")
            } catch (e: Exception) {
                createErrorResponse(e.message ?: "Failed to download script")
            }
        }

        private fun createSuccessResponse(data: Any): String {
            return Gson().toJson(mapOf("success" to true, "data" to data))
        }

        private fun createErrorResponse(error: String): String {
            return Gson().toJson(mapOf("success" to false, "error" to error))
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
