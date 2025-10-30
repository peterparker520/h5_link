import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import './VideoSharePage.css'
import { formatTime } from '../utils/timeFormatter';



const VideoSharePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const repaintTimerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Get data from route state
  const { videoDetails, videoComments } = location.state || {}

  // If no data is available, show error or redirect
  if (!videoDetails || !videoComments) {
    return <div>No video data available</div>
  }

  const { video_info, user_info } = videoDetails
  const { video } = video_info
  const { profile } = user_info
  const { comment_list, comment_count } = videoComments
  const create_time = formatTime(video.create_time);
  const comment_time_1 = formatTime(comment_list[0]?.comment_time);
  const comment_time_2 = formatTime(comment_list[1]?.comment_time);
  const comment_time_3 = formatTime(comment_list[2]?.comment_time);

  // 检测是否为iOS微信环境
  const isIOSWeChat = () => {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('micromessenger') && (ua.includes('iphone') || ua.includes('ipad'))
  }

  // 强制激活GPU渲染层
  const activateGPURendering = (video) => {
    if (isIOSWeChat()) {
      // 多种方式激活GPU渲染 - 使用正确的camelCase属性名
      video.style.transform = 'translateZ(0)'
      video.style.WebkitTransform = 'translateZ(0)'
      video.style.willChange = 'transform'
      video.style.WebkitBackfaceVisibility = 'hidden'
      video.style.backfaceVisibility = 'hidden'
      video.style.WebkitPerspective = '1000px'
      video.style.perspective = '1000px'

      // 强制重绘
      video.style.display = 'none'
      // 触发重排
      // eslint-disable-next-line no-unused-expressions
      video.offsetHeight
      video.style.display = 'block'
    }
  }

  // 开始/停止一个极低开销的重绘保活定时器（仅在 iOS 微信播放时启用）
  const startRepaintKeepAlive = (video) => {
    if (repaintTimerRef.current) return
    repaintTimerRef.current = setInterval(() => {
      // 通过微小的 transform 抖动保持 GPU 合成层活跃，避免卡在首帧
      const t = video.style.transform || ''
      if (!t.includes('translateX(')) {
        video.style.transform = `${t} translateX(0.001px)`
      } else {
        video.style.transform = t.replace(/translateX\([^)]*\)/, 'translateX(0px)')
      }
    }, 250)
  }

  const stopRepaintKeepAlive = () => {
    if (repaintTimerRef.current) {
      clearInterval(repaintTimerRef.current)
      repaintTimerRef.current = null
    }
  }

  // 使用 useEffect 来管理视频元素的生命周期
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // iOS微信特殊处理
      if (isIOSWeChat()) {
        // 设置iOS微信专用属性
        video.setAttribute('webkit-playsinline', 'true')
        video.setAttribute('playsinline', 'true')
        video.setAttribute('x5-playsinline', 'true')
        video.setAttribute('x5-video-player-type', 'h5-page')
        video.setAttribute('x5-video-player-fullscreen', 'false')
        // 修正写法：portrait（原来拼写错误会被忽略）
        video.setAttribute('x5-video-orientation', 'portrait')
        // 在 iOS 微信上尽量让内核完整加载，避免只加载首帧
        video.preload = 'auto'

        // 激活GPU渲染
        activateGPURendering(video)

        // 延迟再次激活GPU渲染，确保生效
        setTimeout(() => {
          activateGPURendering(video)
        }, 100)
      } else {
        // 其他环境按原策略
        video.preload = 'metadata'
      }

      // 视频数据加载完成事件
      const handleLoadedData = () => {
        setIsVideoLoaded(true)

        // 数据加载完成后再次激活GPU渲染
        if (isIOSWeChat()) {
          activateGPURendering(video)
        }
      }

      // 视频开始播放事件
      const handlePlay = () => {
        setIsPlaying(true)

        // iOS 微信相关优化
        if (isIOSWeChat()) {
          // 移除 poster，避免某些内核继续显示首帧图
          video.removeAttribute('poster')

          activateGPURendering(video)

          // 强制刷新视频帧
          const forceRefresh = () => {
            try {
              const currentTime = video.currentTime
              video.currentTime = currentTime + 0.001
              video.currentTime = currentTime
            } catch (e) {
              // 忽略可能的 DOM 异常
            }
          }

          // 延迟刷新，确保视频帧正常显示
          setTimeout(forceRefresh, 50)
          setTimeout(forceRefresh, 200)

          // 开启保活定时器，维持 GPU 渲染
          startRepaintKeepAlive(video)
        }
      }

      // 视频暂停事件
      const handlePause = () => {
        setIsPlaying(false)
        stopRepaintKeepAlive()
      }

      // 视频结束事件
      const handleEnded = () => {
        setIsPlaying(false)
        stopRepaintKeepAlive()
      }

      // 视频加载错误事件
      const handleError = (e) => {
        console.error('视频加载错误:', e)
        setIsVideoLoaded(false)
      }

      // 视频时间更新事件 - 用于iOS微信GPU渲染保持
      const handleTimeUpdate = () => {
        if (isIOSWeChat() && isPlaying) {
          // 定期激活GPU渲染，防止视频帧冻结
          activateGPURendering(video)
        }
      }

      // 添加事件监听器
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)
      video.addEventListener('timeupdate', handleTimeUpdate)

      // 清理函数：组件卸载时移除事件监听器
      return () => {
        stopRepaintKeepAlive()
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('error', handleError)
        video.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [isPlaying]) // 依赖isPlaying状态

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
            <img src={profile.avatar} alt={profile.nickname} />
          </div>
          <div className="user-details">
            <div className="username">
              <span>{profile.nickname} </span>
              <span>
                {profile.gender === 1 && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.792 0.208079C11.6544 0.0704167 11.4664 -0.0046717 11.2721 0.000225368H6.90569C6.50376 0.000225368 6.17798 0.326153 6.17798 0.728257C6.17798 1.13036 6.50376 1.45629 6.90569 1.45629H9.50467L6.96642 3.99569C5.24379 2.76761 2.83716 2.9265 1.29183 4.47252C-0.430611 6.19575 -0.430611 8.9898 1.29183 10.713C3.01736 12.429 5.80398 12.429 7.52951 10.713C9.07483 9.167 9.23346 6.75927 8.00594 5.03587L10.5444 2.49628V5.09644C10.534 5.29196 10.6102 5.48204 10.7523 5.61644C10.8776 5.77151 11.0745 5.85041 11.2721 5.82448C11.4666 5.82937 11.6544 5.75428 11.792 5.61662C11.9296 5.47896 12.0047 5.29106 11.9998 5.09644V0.728075C12.0047 0.533643 11.9296 0.34556 11.792 0.208079ZM6.4898 9.67285C5.34151 10.8217 3.47965 10.8217 2.33135 9.67285C1.18306 8.52403 1.18306 6.66133 2.33135 5.51251C3.46515 4.37821 5.29437 4.36388 6.44575 5.46953C6.46062 5.48368 6.4753 5.498 6.4898 5.51251C7.63321 6.66351 7.63321 8.52204 6.4898 9.67285Z" fill="#1DBAFF" />
                </svg>}
                {profile.gender === 2 && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_60131_6506)">
                    <path d="M10.05 0.952429C8.28186 -0.494116 5.691 -0.26463 4.20254 1.44847L4.04146 1.64539C2.80224 3.25526 2.90356 5.49557 4.20704 6.98524L3.72521 7.57411L1.55106 5.7952C1.26424 5.56052 0.847703 5.59066 0.596913 5.85548L0.53179 5.93515C0.321875 6.23339 0.374874 6.64768 0.661689 6.88219L2.83584 8.66093L1.0571 10.8354C0.92824 10.9748 0.865196 11.1629 0.884074 11.3519C0.902953 11.5409 1.00202 11.7127 1.15582 11.8237C1.29525 11.9525 1.48316 12.0156 1.6723 11.9967C1.86125 11.9778 2.03307 11.8788 2.14426 11.7248L3.923 9.55064L6.09715 11.3294C6.3973 11.575 6.83982 11.5308 7.08541 11.2307C7.331 10.9305 7.28684 10.488 6.98651 10.2424L4.81237 8.46366L5.29541 7.87323C7.05008 8.87067 9.3181 8.49206 10.6432 6.88219C12.1168 5.08094 11.8513 2.42617 10.05 0.952429ZM9.55607 5.99265C8.5737 7.19343 6.80379 7.37043 5.60301 6.38806C4.40224 5.40568 4.22523 3.63578 5.2076 2.435C6.18998 1.23422 7.95988 1.05721 9.16066 2.03959C10.3569 3.02456 10.5334 4.79048 9.55607 5.99265Z" fill="#FF4067" />
                  </g>
                  <defs>
                    <clipPath id="clip0_60131_6506">
                      <rect width="12" height="12" fill="white" />
                    </clipPath>
                  </defs>
                </svg>}
              </span>
            </div>
            <div className="user-meta">
              <span className="location">{video.location.province}</span>
              <span> </span>
              <span className="time">{create_time}</span>
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
            src={video.video_url}
            poster={video.cover_url}
            controls
            // iOS 微信更稳定的内联播放写法
            playsInline
            muted={false}
            autoPlay={false}
            // 其余定制属性通过 setAttribute 在 iOS 微信环境下设置
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'transform',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
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
        <h2 className="video-title">{video.title}</h2>

        {/* 视频描述 */}
        <p className="video-description">
          {video.content}
        </p>

        {/* 推广卡片 */}
        <div className="promo-card">
          <img src={video.template.cover_url} alt={video.template.name} className="promo-image" />
          <div className="promo-content">
            <div className="promo-text-content">
              <div className="promo-header">
                <h3>{video.template.name}</h3>
                <button className="use-template-btn">创作同款</button>
              </div>

              <p className="audio-info">
                <span className="audio-item">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.75 13.0872V3.38338C5.75 2.9821 5.75 2.78146 5.823 2.61873C5.88735 2.47528 5.99097 2.35296 6.12189 2.2659C6.2704 2.16714 6.46831 2.13416 6.86413 2.06819L14.1975 0.845964C14.7316 0.756941 14.9987 0.712429 15.2068 0.789738C15.3895 0.85758 15.5426 0.987279 15.6395 1.15629C15.75 1.34889 15.75 1.61965 15.75 2.16116V11.4205M5.75 13.0872C5.75 14.4679 4.63071 15.5872 3.25 15.5872C1.86929 15.5872 0.75 14.4679 0.75 13.0872C0.75 11.7065 1.86929 10.5872 3.25 10.5872C4.63071 10.5872 5.75 11.7065 5.75 13.0872ZM15.75 11.4205C15.75 12.8013 14.6307 13.9205 13.25 13.9205C11.8693 13.9205 10.75 12.8013 10.75 11.4205C10.75 10.0398 11.8693 8.92054 13.25 8.92054C14.6307 8.92054 15.75 10.0398 15.75 11.4205Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {video?.resource?.bg_music_list?.[0]?.title
                    ? <span className="audio-text">{video.resource.bg_music_list[0].title}</span>
                    : <span>--</span>
                  }
                </span>

                <span className="audio-item">
                  <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.4167 7.41667V9.08333C12.4167 12.305 9.80499 14.9167 6.58333 14.9167M0.75 7.41667V9.08333C0.75 12.305 3.36167 14.9167 6.58333 14.9167M6.58333 14.9167V17.4167M3.25 17.4167H9.91667M6.58333 11.5833C5.20262 11.5833 4.08333 10.464 4.08333 9.08333V3.25C4.08333 1.86929 5.20262 0.75 6.58333 0.75C7.96404 0.75 9.08333 1.86929 9.08333 3.25V9.08333C9.08333 10.464 7.96404 11.5833 6.58333 11.5833Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {video?.resource?.ai_voiceover_list?.[0]?.title
                    ? <span className="audio-text">{video.resource.ai_voiceover_list[0].title}</span>
                    : <span>--</span>
                  }
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 互动区域 */}
        <div className="interaction-bar">
          <div className="interaction-item">
            <span className="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.83341 18.3332V9.1665M1.66675 10.8332V16.6665C1.66675 17.587 2.41294 18.3332 3.33341 18.3332H14.522C15.7559 18.3332 16.8053 17.4329 16.9929 16.2133L17.8903 10.38C18.1233 8.86558 16.9516 7.49984 15.4194 7.49984H12.5001C12.0398 7.49984 11.6667 7.12674 11.6667 6.6665V3.72137C11.6667 2.5865 10.7468 1.6665 9.61188 1.6665C9.3412 1.6665 9.0959 1.82592 8.98596 2.07327L6.05336 8.67162C5.91961 8.97256 5.62118 9.1665 5.29185 9.1665H3.33341C2.41294 9.1665 1.66675 9.9127 1.66675 10.8332Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            </span>
            <span className="count">{video_info.like_count}</span>
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
              <g clipPath="url(#clip0_597_4002)">
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
        
        {/* 分割线 */}
        <div className="line"></div>
        
        {/* 评论区 */}
        <div className="comments-section">
          <h3 className="comments-title">精彩评论 <span style={{color:"#737373"}}>({comment_count})</span></h3>

          {comment_count === 0 ? (
            <div className="no-comments">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="24.981" y="63.126" width="7.68434" height="14.088" rx="2" transform="rotate(20.1737 24.981 63.126)" fill="#D9D9D9" />
                <rect width="7.68434" height="14.088" rx="2" transform="matrix(-0.938651 0.344868 0.344868 0.938651 64.915 63.126)" fill="#D9D9D9" />
                <rect x="8" y="31.4824" width="14.3989" height="36.2657" rx="4" transform="rotate(-4.33059 8 31.4824)" fill="url(#paint0_linear_60280_6600)" />
                <rect width="14.3989" height="36.2657" rx="4" transform="matrix(-0.997145 -0.0755112 -0.0755112 0.997145 82.0718 31.4824)" fill="url(#paint1_linear_60280_6600)" />
                <path d="M20.1226 21C20.1226 15.4772 24.5997 11 30.1226 11H59.8243C65.3472 11 69.8243 15.4772 69.8243 21V53.1262C69.8243 58.6491 65.3472 63.1262 59.8243 63.1262H30.1226C24.5997 63.1262 20.1226 58.6491 20.1226 53.1262V21Z" fill="url(#paint2_linear_60280_6600)" />
                <path d="M75.5225 67.9756C77.7316 67.9756 79.5225 66.1847 79.5225 63.9756L79.5225 57.4287C79.5225 55.2196 77.7316 53.4287 75.5225 53.4287L14.4249 53.4287C12.2157 53.4287 10.4249 55.2196 10.4249 57.4287L10.4249 63.9756C10.4249 66.1847 12.2157 67.9756 14.4249 67.9756L75.5225 67.9756Z" fill="url(#paint3_linear_60280_6600)" />
                <rect x="36.5308" y="26.7607" width="1.46391" height="6.06119" rx="0.731957" transform="rotate(45 36.5308 26.7607)" fill="#D9D9D9" />
                <rect x="32.2446" y="27.7949" width="1.46391" height="6.06119" rx="0.731957" transform="rotate(-45 32.2446 27.7949)" fill="#D9D9D9" />
                <rect x="55.9268" y="26.7607" width="1.46391" height="6.06119" rx="0.731957" transform="rotate(45 55.9268 26.7607)" fill="#D9D9D9" />
                <rect x="51.6406" y="27.7949" width="1.46391" height="6.06119" rx="0.731957" transform="rotate(-45 51.6406 27.7949)" fill="#D9D9D9" />
                <defs>
                  <linearGradient id="paint0_linear_60280_6600" x1="8" y1="49.3988" x2="21.9732" y2="52.0639" gradientUnits="userSpaceOnUse">
                    <stop offset="0.100929" stop-color="#D4D4D4" stop-opacity="0.5" />
                    <stop offset="1" stop-color="#D4D4D4" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_60280_6600" x1="5.74126e-09" y1="18.3493" x2="13.9732" y2="15.6842" gradientUnits="userSpaceOnUse">
                    <stop offset="0.100929" stop-color="#D4D4D4" stop-opacity="0.5" />
                    <stop offset="1" stop-color="#D4D4D4" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_60280_6600" x1="44.9734" y1="11" x2="44.9734" y2="63.1262" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#EEEEEE" />
                    <stop offset="1" stop-color="#F8F8F8" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_60280_6600" x1="44.6774" y1="67.9756" x2="44.6774" y2="53.4287" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#DDDDDD" stop-opacity="0.98" />
                    <stop offset="1" stop-color="#F7F7F7" stop-opacity="0.72" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="no-comments-text">暂无评论，快来抢沙发吧</p>
            </div>
          ) : (
            <div>
              {comment_list[0] && <div className="comment-item">
                <img src={comment_list[0].user_info.avatar} alt={comment_list[0].user_info.nickname} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{comment_list[0].user_info.nickname}</span>
                    {comment_list[0].is_author && <span className="comment-badge">作者</span>}
                    {comment_list[0].is_first_comment && <span className="comment-badge blue">首评</span>}
                  </div>
                  <p className="comment-text">{comment_list[0].content}</p>
                  <div className="comment-meta">
                    <span className="comment-time">{comment_time_1} {comment_list[0].location}</span>
                    <div className="comment-actions">
                      <span className="comment-reply">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        回复
                      </span>
                      <span className="comment-like">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.61961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {comment_list[0].like_count}
                      </span>
                    </div>
                  </div>
                  <div className="show-more-comments">
                    <span>全部{comment_list[0].reply_count}条回复▼</span>
                  </div>
                </div>
              </div>}
            </div>
          )}
          <div className='container'>
            {comment_list[1] && <div className="comment-item">
              <img src={comment_list[1].user_info.avatar} alt={comment_list[1].user_info.nickname} className="comment-avatar" />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{comment_list[1].user_info.nickname}</span>
                  {comment_list[1].is_author && <span className="comment-badge">作者</span>}
                  {comment_list[1].is_first_comment && <span className="comment-badge blue">首评</span>}
                </div>
                <p className="comment-text">{comment_list[1].content}</p>
                <div className="comment-meta">
                  <span className="comment-time">{comment_time_2} {comment_list[1].location}</span>
                  <div className="comment-actions">
                    <span className="comment-reply">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      回复
                    </span>
                    <span className="comment-like">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.91961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {comment_list[1].like_count}
                    </span>
                  </div>
                </div>
                {comment_list[1].reply_count && <div className="show-more-comments">
                  <span>全部{comment_list[1].reply_count}条回复▼</span>
                </div>}
              </div>
            </div>}

            {comment_list[2] && <div className="comment-item">
              <img src={comment_list[2].user_info.avatar} alt={comment_list[2].user_info.nickname} className="comment-avatar" />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-username">{comment_list[2].user_info.nickname}</span>
                  {comment_list[2].is_author && <span className="comment-badge">作者</span>}
                  {comment_list[2].is_first_comment && <span className="comment-badge blue">首评</span>}
                </div>
                <p className="comment-text">{comment_list[2].content}</p>
                <div className="comment-meta">
                  <span className="comment-time">{comment_time_3} {comment_list[2].location}</span>
                  <div className="comment-actions">
                    <span className="comment-reply">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8.66667H6.00889M10 8.66667H10.0089M14 8.66667H14.0089M5.55556 15.3333V17.4093C5.55556 17.883 5.55556 18.1198 5.65265 18.2414C5.73709 18.3472 5.86513 18.4088 6.00048 18.4086C6.15611 18.4084 6.34104 18.2605 6.71089 17.9646L8.8313 16.2683C9.26446 15.9218 9.48104 15.7485 9.72221 15.6253C9.93618 15.516 10.1639 15.4361 10.3993 15.3878C10.6646 15.3333 10.942 15.3333 11.4967 15.3333H13.7333C15.2268 15.3333 15.9735 15.3333 16.544 15.0427C17.0457 14.787 17.4537 14.3791 17.7094 13.8773C18 13.3069 18 12.5601 18 11.0667V6.26667C18 4.77319 18 4.02646 17.7094 3.45603C17.4537 2.95426 17.0457 2.54631 16.544 2.29065C15.9735 2 15.2268 2 13.7333 2H6.26667C4.77319 2 4.02646 2 3.45603 2.29065C2.95426 2.54631 2.54631 2.95426 2.29065 3.45603C2 4.02646 2 4.77319 2 6.26667V11.7778C2 12.6044 2 13.0177 2.09086 13.3569C2.33744 14.2771 3.05624 14.9959 3.97648 15.2425C4.31559 15.3333 4.72891 15.3333 5.55556 15.3333ZM6.44444 8.66667C6.44444 8.91213 6.24546 9.11111 6 9.11111C5.75454 9.11111 5.55556 8.91213 5.55556 8.66667C5.55556 8.42121 5.75454 8.22222 6 8.22222C6.24546 8.22222 6.44444 8.42121 6.44444 8.66667ZM10.4444 8.66667C10.4444 8.91213 10.2455 9.11111 10 9.11111C9.75454 9.11111 9.55556 8.91213 9.55556 8.66667C9.55556 8.42121 9.75454 8.22222 10 8.22222C10.2455 8.22222 10.4444 8.42121 10.4444 8.66667ZM14.4444 8.66667C14.4444 8.91213 14.2455 9.11111 14 9.11111C13.7545 9.11111 13.5556 8.91213 13.5556 8.66667C13.5556 8.42121 13.7545 8.22222 14 8.22222C14.2455 8.22222 14.4444 8.42121 14.4444 8.66667Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      回复
                    </span>
                    <span className="comment-like">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.83341 18.3337V9.16699M1.66675 10.8337V16.667C1.66675 17.5875 2.41294 18.3337 3.33341 18.3337H14.522C15.7559 18.3337 16.8053 17.4334 16.9929 16.2138L17.8903 10.3805C18.1233 8.86607 16.9516 7.50033 15.4194 7.50033H12.5001C12.0398 7.50033 11.6667 7.12723 11.6667 6.66699V3.72186C11.6667 2.58699 10.7468 1.66699 9.61188 1.66699C9.3412 1.66699 9.0959 1.8264 8.98596 2.07376L6.05336 8.67211C5.91961 8.97305 5.62118 9.16699 5.29185 9.16699H3.33341C2.41294 9.16699 1.66675 9.91318 1.66675 10.8337Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {comment_list[2].like_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>

      </div>

      {/* 底部打开APP按钮 - 固定在屏幕底部 */}
      <div className="bottom-app-button">
        <button className="open-app-bottom">打开APP</button>
      </div>

    </div >
  )
}

export default VideoSharePage
