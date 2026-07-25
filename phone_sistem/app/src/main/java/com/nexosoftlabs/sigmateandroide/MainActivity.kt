package com.nexosoftlabs.sigmateandroide

import android.annotation.SuppressLint
import android.content.pm.ApplicationInfo
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var myWebView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Buscamos el WebView definido en la interfaz XML
        myWebView = findViewById(R.id.miWebView)

        // 2. Configuración avanzada del WebView para habilitar todas las funciones del Front-end JS/CSS
        @Suppress("DEPRECATION")
        myWebView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            
            // Permitir que scripts en archivos locales accedan a otros archivos locales (CORS local)
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            
            loadWithOverviewMode = true
            useWideViewPort = true
            builtInZoomControls = false
            displayZoomControls = false
            javaScriptCanOpenWindowsAutomatically = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Habilitar la depuración de WebView en modo Debug para inspeccionar desde Chrome (chrome://inspect)
        if ((applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
            WebView.setWebContentsDebuggingEnabled(true)
        }

        // 3. Puente JavaScript nativo para comunicación entre JS y Kotlin (AndroidBridge)
        myWebView.addJavascriptInterface(WebAppInterface(this), "AndroidBridge")

        // 4. Manejo de consola JS, alertas y registro con WebChromeClient
        myWebView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d("WebViewJS", "${consoleMessage.message()} -- From line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()}")
                return true
            }
        }

        // 5. Configurar WebViewClient para mantener la navegación dentro de la app
        myWebView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                if (url.startsWith("file://") || url.startsWith("about:")) {
                    return false
                }
                return false
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    Log.e("WebViewError", "Error al cargar recurso: ${error?.description}")
                }
            }
        }

        // 6. Manejo del botón Atrás (Navegación dentro de WebView en vez de cerrar la app)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::myWebView.isInitialized && myWebView.canGoBack()) {
                    myWebView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // 7. Cargar el Front-end local desde assets/index.html
        myWebView.loadUrl("file:///android_asset/index.html")
    }

    /**
     * Interfaz para exponer funciones Kotlin al Front-end JavaScript (window.AndroidBridge)
     */
    inner class WebAppInterface(private val activity: AppCompatActivity) {
        @JavascriptInterface
        fun showToast(toast: String) {
            Toast.makeText(activity, toast, Toast.LENGTH_SHORT).show()
        }

        @JavascriptInterface
        fun getAppVersion(): String {
            return "1.0.0"
        }
    }
}

