
import { useRef, useEffect, useState } from 'react';
import './VideoSharePage_Desktop.css'; // We will create this CSS file next
import test_landscap_video from '../img/test_landscap.mp4';
import test_portrait_video from '../img/test_portrait.mp4';
import cover_landscap from '../img/cover_landscap.jpg';
import cover_portrait from '../img/cover_portrait.jpg';
import qr_code from '../img/qr_code.png'; // Assuming you have a QR code image

const VideoSharePage_Desktop = () => {
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    // 使用 useEffect 来管理视频元素的生命周期
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // 视频数据加载完成事件
            const handleLoadedData = () => {
                setIsVideoLoaded(true);
                console.log('视频数据已加载');
            };

            // 视频开始播放事件
            const handlePlay = () => {
                setIsPlaying(true);
                console.log('视频开始播放');
            };

            // 视频暂停事件
            const handlePause = () => {
                setIsPlaying(false);
                console.log('视频暂停');
            };

            // 视频结束事件
            const handleEnded = () => {
                setIsPlaying(false);
                console.log('视频播放结束');
            };

            // 视频加载错误事件
            const handleError = (e) => {
                console.error('视频加载错误:', e);
                setIsVideoLoaded(false);
            };

            // 添加事件监听器
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('ended', handleEnded);
            video.addEventListener('error', handleError);

            // 设置视频预加载策略
            video.preload = 'metadata'; // 只预加载元数据，节省带宽

            // 清理函数：组件卸载时移除事件监听器
            return () => {
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('ended', handleEnded);
                video.removeEventListener('error', handleError);
            };
        }
    }, []); // 空依赖数组确保只在组件挂载时运行一次

    // 点击非视频区域显示二维码模态窗
    const handlePageClick = () => {
        setShowQRModal(true);
    };

    const handleDownloadClick = () => {
        setShowQRModal(true);
    };

    // 关闭模态窗
    const handleCloseModal = () => {
        setShowQRModal(false);
    };

    // 阻止视频区域的点击事件冒泡
    const handleVideoAreaClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="desktop-page-container" onClick={handlePageClick}>
            {/* Top Banner */}
            <div className="desktop-header">
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
                    <div className="header-right">
                        <span className="about-us">关于我们</span>
                        <button className="open-app-btn" onClick={handleDownloadClick}>下载APP</button>
                    </div>
                </div>
            </div>

            <div className="desktop-main-layout">
                {/* Left Column (2/3) */}
                <div className="left-column">
                    <div className="video-content-wrapper">
                        {/* User Info */}
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

                        {/* Video Player */}
                        <div className="video-container landscape" onClick={handleVideoAreaClick}>
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
                                <source src={test_portrait_video} type="video/mp4" />
                                您的浏览器不支持视频播放
                            </video>
                        </div>

                        {/* Tags, Title, Description etc. will go here */}
                        <div className="tags">
                            <span className="tag">#旅行vlog</span>
                            <span className="tag">#旅行日常</span>
                            <span className="tag">#日系旅行</span>
                        </div>
                        <h2 className="video-title">美丽的新疆7日游</h2>
                        <p className="video-description">
                            每一次的旅行，都是与世界的温柔邂逅，值得被记录。走进新疆，非常惊艳的旅行地，编辑提醒的星光，分享每一份美好给大家。
                        </p>

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

                {/* Right Column (1/3) */}
                <div className="right-column">
                    <div className="promo-section">
                        <img src={qr_code} alt="Download App QR Code" className="qr-code-img" />
                        <h3 className="promo-title">扫码下载 时光拍APP</h3>
                        <p className="promo-slogan">记录美好生活，分享动人时刻</p>
                        <button className="download-btn" onClick={handleDownloadClick}>立即下载</button>
                    </div>

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
                                            <path d="M5.75 13.0872V3.38338C5.75 2.9821 5.75 2.78146 5.823 2.61873C5.88735 2.47528 5.99097 2.35296 6.12189 2.2659C6.2704 2.16714 6.46831 2.13416 6.86413 2.06819L14.1975 0.845964C14.7316 0.756941 14.9987 0.712429 15.2068 0.789738C15.3895 0.85758 15.5426 0.987279 15.6395 1.15629C15.75 1.34889 15.75 1.61965 15.75 2.16116V11.4205M5.75 13.0872C5.75 14.4679 4.63071 15.5872 3.25 15.5872C1.86929 15.5872 0.75 14.4679 0.75 13.0872C0.75 11.7065 1.86929 10.5872 3.25 10.5872C4.63071 10.5872 5.75 11.7065 5.75 13.0872ZM15.75 11.4205C15.75 12.8013 14.6307 13.9205 13.25 13.9205C11.8693 13.9205 10.75 12.8013 10.75 11.4205C10.75 10.0398 11.8693 8.92054 13.25 8.92054C14.6307 8.92054 15.75 10.0398 15.75 11.4205Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="audio-text">我是一个 BGM...</span>
                                    </span>

                                    <span className="audio-item">
                                        <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.4167 7.41667V9.08333C12.4167 12.305 9.80499 14.9167 6.58333 14.9167M0.75 7.41667V9.08333C0.75 12.305 3.36167 14.9167 6.58333 14.9167M6.58333 14.9167V17.4167M3.25 17.4167H9.91667M6.58333 11.5833C5.20262 11.5833 4.08333 10.464 4.08333 9.08333V3.25C4.08333 1.86929 5.20262 0.75 6.58333 0.75C7.96404 0.75 9.08333 1.86929 9.08333 3.25V9.08333C9.08333 10.464 7.96404 11.5833 6.58333 11.5833Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="audio-text">中年男子配音</span>
                                    </span>
                                </p>
                            </div>
                        </div>
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
    );
};

export default VideoSharePage_Desktop;

