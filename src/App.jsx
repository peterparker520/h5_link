import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import VideoSharePage from "./components/VideoSharePage";
import VideoSharePage_Desktop from "./components/VideoSharePage_Desktop";
import DownloadPage from "./components/DownloadPage";
import BlankPage from "./components/BlankPage";
import { fetchVideoData } from "./api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndNavigate = async () => {
      const searchParams = new URLSearchParams(location.search);
      const videoId = searchParams.get('video_id');

      if (!videoId) {
        setError('Video ID is missing from the URL.');
        return;
      }

      try {
        const { videoDetails, videoComments, categoryNames } = await fetchVideoData(videoId);
        if (videoDetails.code === 2004 || videoDetails.code === 4501) {
          // setError('The content has been deleted.');
          navigate('/blank', { replace: true });
          return;
        }

        if (videoDetails.code === 200 && videoComments.code === 200) {
          // Check if videoDetails.data is empty/null
          if (!videoDetails.data || Object.keys(videoDetails.data).length === 0) {
            // videoDetails.data is empty, redirect to blank page
            navigate('/blank', { replace: true });
            return;
          }

          // videoDetails.data exists, proceed with normal routing
          const isMobile = window.innerWidth <= 768;
          const targetPath = isMobile ? '/mobile' : '/desktop';
          navigate(targetPath, {
            replace: true,
            state: { videoDetails: videoDetails.data, videoComments: videoComments.data, categoryNames: categoryNames[0].data },
          });
          
        } else {
          setError('Failed to fetch video data.');
        }
      } catch (err) {
        setError('An error occurred while fetching data.');
      }
    };

    // Only fetch data if we are at the root path
    if (location.pathname === '/') {

      fetchDataAndNavigate();
    } else {

    }

    const handleResize = () => {
      const width = window.innerWidth;
      if (location.pathname === "/download" || location.pathname === '/') {
        return;
      }

      const isMobile = width <= 768;
      if (isMobile && location.pathname.startsWith("/desktop")) {
        navigate("/mobile", { replace: true, state: location.state });
      } else if (!isMobile && location.pathname.startsWith("/mobile")) {
        navigate("/desktop", { replace: true, state: location.state });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate, location]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div>Loading...</div>} />
        <Route path="/mobile" element={<VideoSharePage />} />
        <Route path="/desktop" element={<VideoSharePage_Desktop />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/blank" element={<BlankPage />} />
      </Routes>
    </div>
  );
}

export default App;