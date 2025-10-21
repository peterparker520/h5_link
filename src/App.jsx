import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import VideoSharePage from "./components/VideoSharePage";
import VideoSharePage_Desktop from "./components/VideoSharePage_Desktop";
import DownloadPage from "./components/DownloadPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // 如果当前在下载页面，不进行自动跳转
      if (location.pathname === "/download") {
        return;
      }

      if (width <= 1025 && !location.pathname.startsWith("/mobile")) {
        navigate("/mobile", { replace: true });
      } else if (width > 1025 && !location.pathname.startsWith("/desktop")) {
        navigate("/desktop", { replace: true });
      }
    };

    // ✅ 初始化时执行一次
    handleResize();

    // ✅ 防抖 + 添加监听器
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 200);
    };

    window.addEventListener("resize", debouncedResize);

    // ✅ 清理监听器与定时器（组件卸载时）
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [navigate, location]);

  return (
    <div className="app">
      <Routes>
        <Route path="/mobile" element={<VideoSharePage />} />
        <Route path="/desktop" element={<VideoSharePage_Desktop />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </div>
  );
}

export default App;