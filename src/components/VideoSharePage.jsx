import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import './VideoSharePage.css'
import test_portrait_video from '../img/test_portrait.mp4';
import test_landscap_video from '../img/test_landscap.mp4';
import cover_portrait from '../img/cover_portrait.jpg';
import cover_landscap from '../img/cover_landscap.jpg';



const VideoSharePage = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // 使用 useEffect 来管理视频元素的生命周期
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // 视频数据加载完成事件
      const handleLoadedData = () => {
        setIsVideoLoaded(true)
        console.log('视频数据已加载')
      }

      // 视频开始播放事件
      const handlePlay = () => {
        setIsPlaying(true)
        console.log('视频开始播放')
      }

      // 视频暂停事件
      const handlePause = () => {
        setIsPlaying(false)
        console.log('视频暂停')
      }

      // 视频结束事件
      const handleEnded = () => {
        setIsPlaying(false)
        console.log('视频播放结束')
      }

      // 视频加载错误事件
      const handleError = (e) => {
        console.error('视频加载错误:', e)
        setIsVideoLoaded(false)
      }

      // 添加事件监听器
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)

      // 设置视频预加载策略
      video.preload = 'metadata' // 只预加载元数据，节省带宽

      // 清理函数：组件卸载时移除事件监听器
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
      }
    }
  }, []) // 空依赖数组确保只在组件挂载时运行一次

  // 点击非视频区域跳转到下载页面
  const handlePageClick = () => {
    navigate('/download')
  }

  // 阻止视频区域的点击事件冒泡
  const handleVideoAreaClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="video-share-page" onClick={handlePageClick}>
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
          <button className="open-app-btn">打开APP</button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="main-content">
        {/* 用户信息 */}
        <div className="user-info">
          <div className="user-avatar">
            <img src={cover_landscap} alt="人淡如菊" />
          </div>
          <div className="user-details">
            <div className="username">
              <span>人淡如菊</span>
            </div>
            <div className="user-meta">
              <span className="location">北京·海淀区</span>
              <span> </span>
              <span className="time">1周前</span>
            </div>
          </div>
          <button className="follow-btn">关注</button>
        </div>

        {/* 视频区域 */}
        <div
          className={`video-container ${"landscape"}`}
          onClick={handleVideoAreaClick}
        >
          <video
            ref={videoRef}
            className="video-player"
            poster={cover_landscap}
            controls
            preload="metadata"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
          >
            <source src={test_landscap_video} type="video/mp4" />
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
          <img src={cover_portrait} alt="旅行美食模板24镜头" className="promo-image" />
          <div className="promo-content">
            <div className="promo-text-content">
              <div className="promo-header">
                <h3>旅行唯美模板24镜头</h3>
                <button className="use-template-btn">创作同款</button>
              </div>

              <p className="audio-info">
                <span className="audio-item">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.75 13.0872V3.38338C5.75 2.9821 5.75 2.78146 5.823 2.61873C5.88735 2.47528 5.99097 2.35296 6.12189 2.2659C6.2704 2.16714 6.46831 2.13416 6.86413 2.06819L14.1975 0.845964C14.7316 0.756941 14.9987 0.712429 15.2068 0.789738C15.3895 0.85758 15.5426 0.987279 15.6395 1.15629C15.75 1.34889 15.75 1.61965 15.75 2.16116V11.4205M5.75 13.0872C5.75 14.4679 4.63071 15.5872 3.25 15.5872C1.86929 15.5872 0.75 14.4679 0.75 13.0872C0.75 11.7065 1.86929 10.5872 3.25 10.5872C4.63071 10.5872 5.75 11.7065 5.75 13.0872ZM15.75 11.4205C15.75 12.8013 14.6307 13.9205 13.25 13.9205C11.8693 13.9205 10.75 12.8013 10.75 11.4205C10.75 10.0398 11.8693 8.92054 13.25 8.92054C14.6307 8.92054 15.75 10.0398 15.75 11.4205Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="audio-text">我是一个 BGM...</span>
                </span>

                <span className="audio-item">
                  <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4167 7.41667V9.08333C12.4167 12.305 9.80499 14.9167 6.58333 14.9167M0.75 7.41667V9.08333C0.75 12.305 3.36167 14.9167 6.58333 14.9167M6.58333 14.9167V17.4167M3.25 17.4167H9.91667M6.58333 11.5833C5.20262 11.5833 4.08333 10.464 4.08333 9.08333V3.25C4.08333 1.86929 5.20262 0.75 6.58333 0.75C7.96404 0.75 9.08333 1.86929 9.08333 3.25V9.08333C9.08333 10.464 7.96404 11.5833 6.58333 11.5833Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span className="audio-text">中年男子配音</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 互动区域 */}
        <div className="interaction-bar">
          <div className="interaction-item">
            <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.83341 18.3332V9.1665M1.66675 10.8332V16.6665C1.66675 17.587 2.41294 18.3332 3.33341 18.3332H14.522C15.7559 18.3332 16.8053 17.4329 16.9929 16.2133L17.8903 10.38C18.1233 8.86558 16.9516 7.49984 15.4194 7.49984H12.5001C12.0398 7.49984 11.6667 7.12674 11.6667 6.6665V3.72137C11.6667 2.5865 10.7468 1.6665 9.61188 1.6665C9.3412 1.6665 9.0959 1.82592 8.98596 2.07327L6.05336 8.67162C5.91961 8.97256 5.62118 9.1665 5.29185 9.1665H3.33341C2.41294 9.1665 1.66675 9.9127 1.66675 10.8332Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            </span>
            <span className="count">3210</span>
          </div>
          <div className="interaction-item">
            <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 7.5C0 3.35786 3.35786 0 7.5 0H12.5C16.6421 0 20 3.35786 20 7.5V12.5C20 16.6421 16.6421 20 12.5 20H7.5C3.35786 20 0 16.6421 0 12.5V7.5Z" fill="white" />
              <path d="M9.93755 0.5625C9.56255 0.5625 9.25005 0.5625 8.87505 0.625C8.06255 0.75 7.18755 0.9375 6.43755 1.25C5.62505 1.625 12.8126 7.625 12.9376 7.8125V1.0625L12.3751 0.875C11.5626 0.6875 10.7501 0.5625 9.93755 0.5625Z" fill="#FA5452" />
              <path d="M16.625 3.37498C16.375 3.12498 16.125 2.87498 15.8125 2.68748C15.125 2.18748 14.375 1.74998 13.625 1.43748C12.8125 1.12498 13.6875 10.3125 13.625 10.625L18.4375 5.93748C18.375 5.74998 18.25 5.56248 18.125 5.43748C17.75 4.62498 17.1875 3.99998 16.625 3.37498Z" fill="#6467F0" />
              <path d="M18.6875 6.5625C18.6875 6.5625 12.375 12.8125 12.125 13H18.875L19.0625 12.4375C19.25 11.6875 19.375 10.875 19.375 10.0625C19.375 9.6875 19.375 9.375 19.3125 9C19.25 8.125 19 7.3125 18.6875 6.5625Z" fill="#5283F0" />
              <path d="M9.4375 13.75L14.125 18.4375C14.3125 18.375 14.5 18.25 14.625 18.125C15.3125 17.75 16 17.25 16.5625 16.625C16.8125 16.375 17.0625 16.125 17.25 15.8125C17.75 15.125 18.1875 14.4375 18.5 13.6875C18.5625 13.75 9.6875 13.8125 9.4375 13.75Z" fill="#00B1FE" />
              <path d="M7 12.1875V18.9375L7.5625 19.125C8.375 19.3125 9.125 19.4375 9.9375 19.4375C10.3125 19.4375 10.625 19.4375 11 19.375C11.8125 19.25 12.625 19.0625 13.4375 18.75C13.4375 18.75 7.1875 12.375 7 12.1875Z" fill="#66D020" />
              <path d="M6.3125 9.52344L1.5625 14.2734C1.625 14.4609 1.75 14.6484 1.875 14.8359C2.25 15.5234 2.75 16.1484 3.3125 16.7734C3.5625 17.0234 3.8125 17.2734 4.125 17.4609C4.8125 18.0234 5.5 18.3984 6.3125 18.7734C6.3125 18.7734 6.25 9.83594 6.3125 9.52344Z" fill="#9AD122" />
              <path d="M0.875 7.64844C0.671016 8.445 0.566057 9.26368 0.5625 10.0859C0.5625 10.4609 0.5625 10.7734 0.625 11.1484C0.75 12.0234 0.9375 12.8359 1.25 13.5859C1.25 13.5859 7.5625 7.21094 7.8125 7.08594H1.0625C1 7.21094 0.9375 7.46094 0.875 7.64844Z" fill="#FFC817" />
              <path d="M5.3125 1.8125C4.5625 2.25 3.9375 2.75 3.375 3.3125L2.625 4.0625C2.125 4.75 1.6875 5.4375 1.375 6.1875C1.375 6.1875 10.25 6.125 10.5625 6.1875L5.8125 1.5625C5.625 1.625 5.4375 1.75 5.3125 1.8125Z" fill="#FF7612" />
            </svg>
            </span>
            <span className="text">分享朋友圈</span>
          </div>
          <div className="interaction-item">
            <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_597_4002)">
                <path d="M19.7422 12.2656C19.7422 9.50781 16.9824 7.26172 13.8848 7.26172C10.6035 7.26172 8.01953 9.50977 8.01953 12.2656C8.01953 15.0273 10.6035 17.2695 13.8848 17.2695C14.5723 17.2695 15.2656 17.0957 15.9551 16.9238L17.8457 17.959L17.3262 16.2363C18.7109 15.1973 19.7422 13.8203 19.7422 12.2656ZM12.0703 11.5C11.6387 11.5 11.2891 11.1504 11.2891 10.7188C11.2891 10.2871 11.6387 9.9375 12.0703 9.9375C12.502 9.9375 12.8516 10.2871 12.8516 10.7188C12.8516 11.1484 12.502 11.5 12.0703 11.5ZM15.8652 11.4941C15.4336 11.4941 15.084 11.1445 15.084 10.7129C15.084 10.2813 15.4336 9.93164 15.8652 9.93164C16.2969 9.93164 16.6465 10.2813 16.6465 10.7129C16.6465 11.1445 16.2969 11.4941 15.8652 11.4941Z" fill="#00C800" />
                <path d="M7.1543 2.08838C3.36328 2.08838 0.257812 4.67236 0.257812 7.95361C0.257812 9.84815 1.29102 11.4028 3.01758 12.6099L2.32813 14.6841L4.73828 13.4751C5.60156 13.645 6.29297 13.8208 7.1543 13.8208C7.37109 13.8208 7.58594 13.811 7.79883 13.7935C7.66406 13.3325 7.58594 12.8501 7.58594 12.3481C7.58594 9.33447 10.1738 6.88916 13.4492 6.88916C13.6738 6.88916 13.8945 6.90479 14.1133 6.93018C13.5156 4.15283 10.5449 2.08838 7.1543 2.08838ZM4.83789 6.8208C4.32031 6.8208 3.90039 6.40088 3.90039 5.8833C3.90039 5.36572 4.32031 4.9458 4.83789 4.9458C5.35547 4.9458 5.77539 5.36572 5.77539 5.8833C5.77539 6.40088 5.35547 6.8208 4.83789 6.8208ZM9.6543 6.8208C9.13672 6.8208 8.7168 6.40088 8.7168 5.8833C8.7168 5.36572 9.13672 4.9458 9.6543 4.9458C10.1719 4.9458 10.5918 5.36572 10.5918 5.8833C10.5918 6.40088 10.1719 6.8208 9.6543 6.8208Z" fill="#00C800" />
              </g>
              <defs>
                <clipPath id="clip0_597_4002">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            </span>
            <span className="text">分享微信</span>
          </div>
        </div>

        {/* 评论区 */}
        <div className="comments-section">
          <h3 className="comments-title">精彩评论 (123)</h3>

          <div className="comment-item">
            <img src={cover_landscap} alt="人淡如菊" className="comment-avatar" />
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
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    回复
                  </span>
                  <span className="comment-like">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.91961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    123
                  </span>
                </div>
              </div>
              <div className="show-more-comments">
                <span>全部4条回复▼</span>
              </div>
            </div>
          </div>
          <div class="container">
          <div className="comment-item">
            <img src={cover_landscap} alt="热爱生活" className="comment-avatar" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-username">热爱生活</span>
              </div>
              <p className="comment-text">拍的太美了</p>
              <div className="comment-meta">
                <span className="comment-time">3天前 来自北京</span>
                <div className="comment-actions">
                  <span className="comment-reply">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    回复
                  </span>
                  <span className="comment-like">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.91961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="comment-item">
            <img src={cover_landscap} alt="来自北方的张哥" className="comment-avatar" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-username">来自北方的张哥</span>
              </div>
              <p className="comment-text">我也去过这里，真的很美～</p>
              <div className="comment-meta">
                <span className="comment-time">3天前 来自北京</span>
                <div className="comment-actions">
                  <span className="comment-reply">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    回复
                  </span>
                  <span className="comment-like">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.91961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    123
                  </span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

      </div>

      {/* 底部打开APP按钮 - 固定在屏幕底部 */}
      <div className="bottom-app-button">
        <button className="open-app-bottom">打开APP</button>
      </div>

    </div>
  )
}

export default VideoSharePage
