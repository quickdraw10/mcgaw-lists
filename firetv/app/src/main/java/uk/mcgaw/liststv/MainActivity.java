package uk.mcgaw.liststv;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** McGaw Lists on Fire TV: opens the family TV dashboard full screen and keeps the screen awake. */
public class MainActivity extends Activity {
    private static final String HOME = "https://quickdraw10.github.io/mcgaw-lists/#/tv";
    private WebView web;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON | WindowManager.LayoutParams.FLAG_FULLSCREEN);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0B0B0F"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // keeps you signed in
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString(s.getUserAgentString() + " McGawListsTV/1");
        CookieManager.getInstance().setAcceptCookie(true);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                String host = r.getUrl().getHost();
                // Stay inside the app for McGaw Lists and its sign-in; ignore anything else
                return host == null || !(host.endsWith("github.io") || host.endsWith("supabase.co"));
            }
            @Override
            public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
                if (r.isForMainFrame()) showOffline();
            }
        });
        setContentView(web);
        hideBars();
        if (state != null) web.restoreState(state); else web.loadUrl(HOME);
    }

    private void showOffline() {
        String html = "<html><body style='margin:0;background:#0B0B0F;color:#fff;font-family:sans-serif;display:flex;height:100vh;align-items:center;justify-content:center;text-align:center'>"
            + "<div><h1 style='font-size:44px'>Can’t reach McGaw Lists</h1><p style='font-size:24px;color:#8E8E93'>Check the TV’s internet connection.</p>"
            + "<button autofocus onclick=\"location.href='" + HOME + "'\" style='margin-top:24px;font-size:26px;padding:14px 34px;border-radius:999px;border:0;background:#0A84FF;color:#fff'>Try again</button></div></body></html>";
        web.loadDataWithBaseURL(HOME, html, "text/html", "utf-8", null);
    }

    private void hideBars() {
        web.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    public boolean onKeyDown(int code, KeyEvent e) {
        if (code == KeyEvent.KEYCODE_BACK && web.canGoBack()) { web.goBack(); return true; }
        // The remote's menu button reloads the dashboard
        if (code == KeyEvent.KEYCODE_MENU) { web.loadUrl(HOME); return true; }
        return super.onKeyDown(code, e);
    }

    @Override protected void onResume() { super.onResume(); hideBars(); web.onResume(); }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }
}
