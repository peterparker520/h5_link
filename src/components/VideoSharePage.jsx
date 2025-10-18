import { useNavigate } from 'react-router-dom'
import './VideoSharePage.css'
import  { useRef, useState } from "react";
import wechat from '../img/wechat.png';
import wechatMoment from '../img/wechat_moment.png';
import thumb from '../img/thumb.png';
import reply from '../img/reply.png';
import music from '../img/music.png';
import microphone from '../img/microphone.png';
import test_portrait_video from '../img/test_portrait.mp4';
import test_landscap_video from '../img/test_landscap.mp4';
import cover_portrait from '../img/cover_portrait.jpg';
import cover_landscap from '../img/cover_landscap.jpg';



const VideoSharePage = () => {
  const navigate = useNavigate()

  // 点击非视频区域跳转到下载页面
  const handlePageClick = () => {
    navigate('/download')
  }

  // 阻止视频区域的点击事件冒泡
  const handleVideoAreaClick = (e) => {
    e.stopPropagation()
  }

  const videoRef = useRef(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      const { videoWidth, videoHeight } = video;
      setIsPortrait(videoHeight > videoWidth); // 判断是否竖屏
    }
  };

  return (
    <div className="video-share-page" onClick={handlePageClick}>

      {/* 顶部banner */}
      <div className="header">
        <div className="brand-info">
          <div className="brand-icon">
            <img src="/logo.png" alt="时光拍" />
          </div>
          <div className="brand-text">
            <span className="brand-name">时光拍</span>
            <span className="brand-slogan">时光会走远，美剪能留痕</span>
          </div>
        </div>
        <button className="open-app-btn">打开APP</button>
      </div>

      {/* 用户信息 */}
      <div className="user-info">
        <div className="user-avatar">
          <img src="/logo.png" alt="人淡如菊" />
        </div>
        <div className="user-details">
          <div className="username">
            <span>人淡如菊</span>
            <span className="vip-badge">作者认证</span>
          </div>
          <div className="user-meta">
            <span className="location">北京·海淀区</span>
            <span className="time">1周前</span>
          </div>
        </div>
        <button className="follow-btn">关注</button>
      </div>

      {/* 视频区域 */}
      <div
        className={`video-container ${isPortrait ? "portrait" : "landscape"}`}
        onClick={handleVideoAreaClick}
      >
        <video
          ref={videoRef}
          className="video-player"
          poster={cover_portrait}
          controls
          onLoadedMetadata={handleLoadedMetadata}
        >
          <source src={test_portrait_video} type="video/mp4" />
          您的浏览器不支持视频播放
        </video>
      </div>

      {/* 标签区域 */}
      <div className="tags">
        <span className="tag">#旅行vlog</span>
        <span className="tag">#旅行日常</span>
        <span className="tag">#日系旅行</span>
      </div>

      {/* 视频标题 */}
      <h2 className="video-title">美丽的新疆7日游</h2>

      {/* 视频描述 */}
      <p className="video-description">
        每一次的旅行，都是与世界的温柔邂逅，值得被记录。走进新疆，非常惊艳的旅行地，编辑提醒的星光，分享每一份美好给大家。
      </p>

      {/* 推广卡片 */}
      <div className="promo-card">
        <img src="/logo.png" alt="旅行美食模板24镜头" className="promo-image" />
        <div className="promo-content">
          <div className="promo-text-content">
            <div className="promo-header">
              <h3>旅行唯美模板24镜头</h3>
              <button className="use-template-btn">创作同款</button>
            </div>

            <p className="audio-info">
              <span className="audio-item">
                <img src={music} alt="配乐" className="audio-icon" />
                <span className="audio-text">我是一个 BGM...</span>
              </span>

              <span className="audio-item">
                <img src={microphone} alt="配音" className="audio-icon" />
                <span className="audio-text">中年男子配音</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 互动区域 */}
      <div className="interaction-bar">
        <div className="interaction-item">
          <span className="icon"><img src={thumb} alt="点赞" /></span>
          <span className="count">3210</span>
        </div>
        <div className="interaction-item">
          <span className="icon"><img src={wechatMoment} alt="分享朋友圈" /></span>
          <span className="text">分享朋友圈</span>
        </div>
        <div className="interaction-item">
          <span className="icon"><img src={wechat} alt="分享微信" /></span>
          <span className="text">分享微信</span>
        </div>
      </div>


      {/* 评论区 */}
      <div className="comments-section">
        <h3 className="comments-title">精彩评论 (123)</h3>

        <div className="comment-item">
          <img src="/logo.png" alt="人淡如菊" className="comment-avatar" />
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-username">人淡如菊</span>
              <span className="comment-badge">作者</span>
              <span className="comment-badge blue">首评</span>
            </div>
            <p className="comment-text">走进你的美，美好的时光记录，拍摄旅途的美光，分享每一份美好给大家。</p>
            <div className="comment-meta">
              <span className="comment-time">12-10 来自北京</span>
              <div className="comment-actions">
                <span className="comment-reply">
                  <img src={reply} alt="回复" className="reply-icon" />
                  回复
                </span>
                <span className="comment-like">
                  <img src={thumb} alt="点赞" className="like-icon" />
                  123
                </span>
              </div>
            </div>
            <div className="show-more-comments">
              <span>全部4条回复▼</span>
            </div>
          </div>
        </div>

        <div className="comment-item">
          <img src="/logo.png" alt="热爱生活" className="comment-avatar" />
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-username">热爱生活</span>
            </div>
            <p className="comment-text">拍的太美了</p>
            <div className="comment-meta">
              <span className="comment-time">3天前 来自北京</span>
              <div className="comment-actions">
                <span className="comment-reply">
                  <img src={reply} alt="回复" className="reply-icon" />
                  回复
                </span>
                <span className="comment-like">
                  <img src={thumb} alt="点赞" className="like-icon" />
                  3
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="comment-item">
          <img src="/logo.png" alt="来自北方的张哥" className="comment-avatar" />
          <div className="comment-content">
            <div className="comment-header">
              <span className="comment-username">来自北方的张哥</span>
            </div>
            <p className="comment-text">我也去过这里，真的很美～</p>
            <div className="comment-meta">
              <span className="comment-time">3天前 来自北京</span>
              <div className="comment-actions">
                <span className="comment-reply">
                  <img src={reply} alt="回复" className="reply-icon" />
                  回复
                </span>
                <span className="comment-like">
                  <img src={thumb} alt="点赞" className="like-icon" />
                  123
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部打开APP按钮 */}
      <div className="bottom-app-button">
        <button className="open-app-bottom">打开APP</button>
      </div>
    </div>
  )
}

export default VideoSharePage
