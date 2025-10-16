import { Routes, Route } from 'react-router-dom'
import VideoSharePage from './components/VideoSharePage'
import DownloadPage from './components/DownloadPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<VideoSharePage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </div>
  )
}

export default App
