/**
 * 格式化时间显示
 * @param {string|number} timestamp - 时间戳或时间字符串
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(timestamp) {
  let date;
  
  // 处理不同格式的时间输入
  if (typeof timestamp === 'string') {
    // 处理 ISO 格式的时间字符串
    if (timestamp.includes('T')) {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
  } else if (typeof timestamp === 'number') {
    // 处理时间戳（秒或毫秒）
    date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000);
  } else {
    return '时间格式错误';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 0-59秒：显示"刚刚"
  if (diffSeconds < 60) {
    return '刚刚';
  }

  // 1分钟-1小时：显示"xx分钟前"
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  // 1-24小时：显示"xx小时前"
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }

  // 1-7天：显示"x天前"
  if (diffDays <= 7) {
    return `${diffDays}天前`;
  }

  // 7天以上，但在当年内：显示"月-日"
  const currentYear = now.getFullYear();
  const dateYear = date.getFullYear();
  
  if (dateYear === currentYear) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }

  // 跨年份：显示"年-月-日"
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}
