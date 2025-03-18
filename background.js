// 初始化设置
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['darkMode', 'brightness', 'exceptions'], function(data) {
    // 如果没有保存的设置，设置默认值
    const defaultSettings = {};
    
    if (data.darkMode === undefined) {
      defaultSettings.darkMode = false;
    }
    
    if (data.brightness === undefined) {
      defaultSettings.brightness = 100; // 默认亮度为100%
    }
    
    if (data.exceptions === undefined) {
      defaultSettings.exceptions = [];
    }
    
    // 一次性设置所有默认值，减少写操作次数
    if (Object.keys(defaultSettings).length > 0) {
      chrome.storage.sync.set(defaultSettings);
    }
  });
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    // 获取当前设置并应用到新加载的页面
    chrome.storage.sync.get(['darkMode', 'brightness', 'exceptions'], function(data) {
      // 检查当前网站是否在例外列表中
      const url = new URL(tab.url);
      const hostname = url.hostname;
      const isException = data.exceptions && data.exceptions.some(site => site === hostname);
      
      if (!isException) {
        // 如果启用了暗黑模式，发送消息应用暗黑模式
        if (data.darkMode) {
          chrome.tabs.sendMessage(tabId, { 
            action: 'toggleDarkMode', 
            darkMode: data.darkMode,
            brightness: data.brightness || 100 // 默认亮度为100%
          });
        }
        // 如果设置了亮度且不是默认值，发送消息应用亮度
        else if (data.brightness && data.brightness !== 100) {
          chrome.tabs.sendMessage(tabId, { 
            action: 'updateBrightness', 
            brightness: data.brightness,
            darkMode: false
          });
        }
      }
    });
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkSiteException') {
    chrome.storage.sync.get(['exceptions'], function(data) {
      const isException = data.exceptions && data.exceptions.some(site => site === request.hostname);
      sendResponse({ isException: isException });
    });
    return true; // 保持消息通道开放，以便异步响应
  }
});