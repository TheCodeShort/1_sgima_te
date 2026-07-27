package com.nexosoftlabs.sigmateandroide // ASEGÚRATE DE QUE ESTA LÍNEA COINCIDA CON TU PAQUETE ACTUAL

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Creamos el WebView de forma dinámica para ocupar toda la pantalla
        val myWebView = WebView(this)
        setContentView(myWebView)

        // 2. Configuramos los permisos obligatorios para JavaScript del Frontend
        myWebView.settings.javaScriptEnabled = true
        myWebView.settings.domStorageEnabled = true
        myWebView.settings.allowFileAccess = true

        // 3. Instanciamos el cargador simulado de Google
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        // 4. Interceptamos las peticiones fetch() internas de tu app.js
        myWebView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                // Engaña al fetch() buscando el archivo en la carpeta assets real
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                Log.e("WebViewError", "Error al cargar recurso: ${error?.description}")
            }
        }

        // 5. ¡Arrancamos la app simulando que está en la nube de forma 100% offline!
        myWebView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }
}
