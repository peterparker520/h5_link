import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css'
import qr_code from '../img/qr_code.png';

const LoadingPage = () => {
  const navigate = useNavigate();
  const [showQRModal, setShowQRModal] = useState(false);

  const handleOpenAppClick = () => {
    if (window.innerWidth <= 768) {
      // 移动端 → 跳转下载页
      navigate('/download');
    } else {
      // 桌面端 → 打开二维码模态窗
      setShowQRModal(true);
    }
  };

  // 关闭模态窗
  const handleCloseModal = () => {
    setShowQRModal(false);
  };

  return (
    <div>
      {/* 顶部banner */}
      <div className="header">
        <div className="header-content">
          <div className="brand-info">
            <div className="brand-icon">
              <img src="/logo.png" alt="时光拍" />
            </div>
            <div className="brand-text">
              <span className="brand-name">时光拍</span>
              <span className="brand-slogan">时光拍，拍摄美好时光</span>
            </div>
          </div>
          <button className="open-app-btn" onClick={handleOpenAppClick}>打开APP</button>
        </div>
      </div>
      <div className="loading-page">
        <div className="loading-content">
          <div className="loading-message">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="qr-modal-overlay" onClick={handleCloseModal}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>扫码下载 时光拍APP</h3>
              <button className="qr-modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="qr-modal-body">
              <img src={qr_code} alt="Download App QR Code" className="qr-modal-img" />
              <p className="qr-modal-text">使用手机扫描二维码下载APP</p>
              <p className="qr-modal-slogan">记录美好生活，分享动人时刻</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingPage
