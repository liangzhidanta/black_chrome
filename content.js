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
  styleElement.textContent = `
    html, body, div, section, article, header, footer, nav, aside, main {
      background-color: #1a1a1a !important;
      color: #e8e8e8 !important;
    }
    
    a {
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
    
    /* 反转某些元素的颜色 */
    .inverted, svg, [class*="logo"] {
      filter: invert(0.85) !important;
    }
    
    /* 确保所有文本元素都有浅色文字 */
    p, span, h1, h2, h3, h4, h5, h6, li, td, th, caption, label, strong, em, small, blockquote, code, pre {
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