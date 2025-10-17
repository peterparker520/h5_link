import React, { useEffect } from "react";

const OpenAppButton = () => {
  const universalLink = "https://yourdomain.com/ulink/open"; // iOS 通用链接
  const androidScheme = "myapp://open?from=wechat"; // Android 协议
  const downloadUrl = "https://apps.apple.com/app/id1234567890"; // App Store / APK 下载地址
  // =====================================

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isWeChat = /micromessenger/i.test(navigator.userAgent);

  // 主唤起函数
  const openApp = () => {
    const now = Date.now();

    if (isWeChat && isAndroid) {
      // 微信 Android 禁止 Scheme 唤起
      alert("请点击右上角菜单，选择“在浏览器中打开”，再尝试打开App");
      return;
    }

    if (isIOS) {
      window.location.href = universalLink;
    } else if (isAndroid) {
      window.location.href = androidScheme;
    }

    // 未唤起时跳转下载页
    setTimeout(() => {
      if (Date.now() - now < 2000) {
        window.location.href = downloadUrl;
      }
    }, 1500);
  };

  // 页面加载后自动尝试唤起（可选）
  useEffect(() => {
    openApp();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f8f8",
      }}
    >
      <button
        onClick={openApp}
        style={{
          backgroundColor: "#07c160",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        打开App
      </button>

      <p
        style={{
          color: "#666",
          fontSize: "14px",
          marginTop: "16px",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        如果未自动跳转，请点击上方按钮打开应用。
      </p>
    </div>
  );
};

export default OpenAppButton;
