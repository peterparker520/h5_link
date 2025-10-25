import './DownloadPage.css'
import backgroundImage from '../img/image.png'

const DownloadPage = () => {
  return (
    <div
      className="new-download-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="download-button-container">
        <button className="new-download-btn">立即下载</button>
      </div>
    </div>
  )
}

export default DownloadPage
