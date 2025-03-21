// 创建样式元素
let styleElement = document.createElement('style');
styleElement.id = 'black-safari-style';
document.documentElement.appendChild(styleElement);

// 检查当前网站是否在例外列表中
const hostname = window.location.hostname;
chrome.runtime.sendMessage({ action: 'checkSiteException', hostname: hostname }, function(response) {
  if (!response.isException) {
    // 获取当前设置并应用
    chrome.storage.sync.get(['darkMode'], function(data) {
      if (data.darkMode) {
        applyDarkMode();
      }
    });
  }
});

// 监听来自弹出窗口的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleDarkMode') {
    if (request.darkMode) {
      applyDarkMode();
      // 如果同时提供了亮度值，也应用亮度设置
      if (request.brightness) {
        applyBrightness(request.brightness);
      }
    } else {
      removeDarkMode();
      // 移除亮度滤镜
      removeBrightness();
    }
  } else if (request.action === 'updateBrightness') {
    // 处理亮度调整消息
    applyBrightness(request.brightness);
    // 如果同时启用了暗黑模式，确保暗黑模式样式也被应用
    if (request.darkMode) {
      applyDarkMode();
    }
  }
});

// 应用暗黑模式
function applyDarkMode() {
  // 检测当前网站类型，为特定网站应用定制化规则
  const hostname = window.location.hostname;
  let siteSpecificRules = '';
  
  // 针对视频网站的特殊处理
  if (hostname.includes('vidhub') || hostname.includes('bilibili') || hostname.includes('youtube') || hostname.includes('iqiyi') || hostname.includes('youku')) {
    siteSpecificRules = `
      /* 针对视频网站的特殊处理 */
      .video-player, .player-container, .video-container, .fullscreen-container,
      [class*="player-area"], [class*="player-box"], [class*="player-wrapper"],
      [class*="video-area"], [class*="video-box"], [class*="video-wrapper"] {
        background-color: initial !important;
        color: initial !important;
        filter: none !important;
      }
      
      /* 确保视频控制条可见 */
      [class*="control"], [class*="Control"], [class*="progress"], [class*="Progress"],
      [class*="volume"], [class*="Volume"], [class*="button"], [class*="Button"] {
        background-color: initial !important;
        color: initial !important;
        filter: none !important;
      }
    `;
  }
  styleElement.textContent = `
    /* 排除视频播放器和特定元素 */
    [class*="player"], [class*="Player"], [class*="video"], [class*="Video"], [class*="media"], [class*="Media"],
    [id*="player"], [id*="Player"], [id*="video"], [id*="Video"], [id*="media"], [id*="Media"],
    .no-dark-mode, [data-theme="light"],
    iframe, embed, object, canvas, [class*="editor"], [class*="Editor"],
    /* 排除视频网站特定元素 */
    [class*="bili-"], [id*="bili-"],
    [class*="vidhub-"], [id*="vidhub-"],
    [class*="player-container"], [id*="player-container"],
    [class*="fullscreen"], [id*="fullscreen"],
    [class*="video-container"], [id*="video-container"] {
      background-color: initial !important;
      color: initial !important;
      filter: none !important;
    }
    
    /* 排除视频播放器内的所有元素 */
    [class*="player"] *, [class*="Player"] *, [class*="video"] *, [class*="Video"] *, [class*="media"] *, [class*="Media"] *,
    [id*="player"] *, [id*="Player"] *, [id*="video"] *, [id*="Video"] *, [id*="media"] *, [id*="Media"] *,
    /* 排除视频网站特定元素内的所有元素 */
    [class*="bili-"] *, [id*="bili-"] *,
    [class*="vidhub-"] *, [id*="vidhub-"] *,
    [class*="player-container"] *, [id*="player-container"] *,
    [class*="fullscreen"] *, [id*="fullscreen"] *,
    [class*="video-container"] *, [id*="video-container"] * {
      background-color: initial !important;
      color: initial !important;
      filter: none !important;
      border-color: initial !important;
    }
    
    /* 更精确地选择需要变暗的元素，避免将全屏覆盖元素变黑 */
    html, body {
      background-color: #1a1a1a !important;
      color: #e8e8e8 !important;
    }
    
    /* 对div等容器元素使用更精确的选择器，排除可能是全屏覆盖的元素 */
    div:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="container"]):not([class*="wrapper"]):not([class*="player"]):not([class*="video"]):not([class*="media"]):not([class*="fullscreen"]):not([class*="vidhub"]),
    section:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]):not([class*="fullscreen"]):not([class*="vidhub"]),
    article:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]),
    header:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]),
    footer:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]),
    nav:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]),
    aside:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]),
    main:not([class*="overlay"]):not([class*="backdrop"]):not([class*="background"]):not([class*="player"]):not([class*="video"]):not([class*="media"]) {
      background-color: #1a1a1a !important;
      color: #e8e8e8 !important;
    }
    
    /* 链接颜色设置，确保影片名等重要文本显示为白色 */
    a {
      color: #e8e8e8 !important;
    }
    
    /* 为特定链接保留蓝色 */
    a[href]:hover, a.external, a.navigation {
      color: #3391ff !important;
    }
    
    input, textarea, select, button {
      background-color: #2a2a2a !important;
      color: #e8e8e8 !important;
      border-color: #444 !important;
    }
    
    img, video {
      filter: brightness(0.8) !important;
    }
    
    /* 排除特定图片不应用亮度调整 */
    img[class*="logo"], img[class*="icon"], .no-dark-mode img {
      filter: none !important;
    }
    
    /* 反转某些元素的颜色 */
    .inverted, svg, [class*="logo"] {
      filter: invert(0.85) !important;
    }
    
    /* 确保所有文本元素都有浅色文字 */
    p, span, h1, h2, h3, h4, h5, h6, li, td, th, caption, label, strong, em, small, blockquote, code, pre,
    [class*="title"], [class*="name"], [class*="header"], [class*="text"], [class*="content"],
    .title, .name, .header, .text, .content, .description {
      color: #e8e8e8 !important;
    }
    
    /* 确保所有容器元素都有深色背景 */
    table, tr, td, th, ul, ol, menu, form, fieldset, legend, details, summary {
      background-color: #1a1a1a !important;
    }
    
    /* 确保边框颜色适合深色模式 */
    *, *::before, *::after {
      border-color: #444 !important;
    }
  `;
}

// 移除暗黑模式
function removeDarkMode() {
  // 保留亮度设置，但移除暗黑模式样式
  const brightnessStyle = document.querySelector('#black-safari-brightness');
  styleElement.textContent = brightnessStyle ? brightnessStyle.textContent : '';
}

// 应用亮度设置
function applyBrightness(brightnessValue) {
  // 创建或获取亮度样式元素
  let brightnessElement = document.querySelector('#black-safari-brightness');
  if (!brightnessElement) {
    brightnessElement = document.createElement('style');
    brightnessElement.id = 'black-safari-brightness';
    document.documentElement.appendChild(brightnessElement);
  }
  
  // 设置亮度样式
  brightnessElement.textContent = `
    html {
      filter: brightness(${brightnessValue}%) !important;
    }
  `;
  
  // 如果styleElement中已有内容，确保亮度设置不会被覆盖
  if (styleElement.textContent) {
    // 保留原有的暗黑模式样式
  }
}

// 移除亮度设置
function removeBrightness() {
  const brightnessElement = document.querySelector('#black-safari-brightness');
  if (brightnessElement) {
    brightnessElement.textContent = '';
  }
}