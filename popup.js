document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const brightnessSlider = document.getElementById('brightnessSlider');
  const brightnessValue = document.getElementById('brightnessValue');
  const previewContent = document.getElementById('previewContent');
  const websiteExceptions = document.getElementById('websiteExceptions');
  const aboutLink = document.getElementById('aboutLink');
  
  // 更新扩展图标函数
  function updateExtensionIcon(isDarkMode) {
    const iconPath = isDarkMode ? {
      16: 'images/moon.svg',
      48: 'images/moon.svg',
      128: 'images/moon.svg'
    } : {
      16: 'images/sun.svg',
      48: 'images/sun.svg',
      128: 'images/sun.svg'
    };
    chrome.action.setIcon({ path: iconPath });
    console.log('图标已更新为:', isDarkMode ? '月亮' : '太阳');
  }

  // 加载保存的设置
  chrome.storage.sync.get(['darkMode', 'brightness', 'exceptions'], function(data) {
    // 设置暗黑模式开关状态
    const isDarkMode = data.darkMode !== undefined ? data.darkMode : false;
    darkModeToggle.checked = isDarkMode;
    updatePreview();
    
    // 更新扩展图标
    updateExtensionIcon(isDarkMode);
    
    // 设置亮度滑块
    if (data.brightness !== undefined) {
      brightnessSlider.value = data.brightness;
      brightnessValue.textContent = data.brightness + '%';
    }
  });

  // 暗黑模式开关事件
  darkModeToggle.addEventListener('change', function() {
    const isDarkMode = darkModeToggle.checked;
    
    // 保存设置
    chrome.storage.sync.set({ darkMode: isDarkMode });
    
    // 更新预览
    updatePreview();
    
    // 更新扩展图标
    updateExtensionIcon(isDarkMode);
    
    // 向当前标签页发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'toggleDarkMode', 
        darkMode: isDarkMode,
        brightness: brightnessSlider.value
      });
    });
  });

  // 亮度滑块事件
  brightnessSlider.addEventListener('input', function() {
    const brightnessVal = brightnessSlider.value;
    brightnessValue.textContent = brightnessVal + '%';
    
    // 保存设置
    chrome.storage.sync.set({ brightness: brightnessVal });
    
    // 更新预览
    updatePreview();
    
    // 向当前标签页发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'updateBrightness', 
        brightness: brightnessVal,
        darkMode: darkModeToggle.checked
      });
    });
  });

  // 网站例外列表点击事件
  websiteExceptions.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  // 关于链接点击事件
  aboutLink.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'about.html' });
  });

  // 更新预览函数
  function updatePreview() {
    if (darkModeToggle.checked) {
      previewContent.style.backgroundColor = '#1a1a1a';
      previewContent.style.color = '#ffffff';
      previewContent.textContent = '夜间模式已启用';
    } else {
      previewContent.style.backgroundColor = '#ffffff';
      previewContent.style.color = '#000000';
      previewContent.textContent = '网页内容预览';
    }
    
    // 应用亮度
    const brightness = brightnessSlider.value;
    previewContent.style.filter = `brightness(${brightness}%)`;
  }
});