document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('backButton');
  const exceptionsList = document.getElementById('exceptionsList');
  const addExceptionBtn = document.getElementById('addExceptionBtn');
  
  // 加载保存的例外网站列表
  loadExceptions();
  
  // 返回按钮点击事件
  backButton.addEventListener('click', function(e) {
    e.preventDefault();
    window.close();
  });
  
  // 添加例外网站按钮点击事件
  addExceptionBtn.addEventListener('click', function() {
    const url = prompt('请输入要添加到例外列表的网站域名：\n例如: youtube.com');
    if (url) {
      addException(url.trim());
    }
  });
  
  // 加载例外网站列表
  function loadExceptions() {
    chrome.storage.sync.get(['exceptions'], function(data) {
      const exceptions = data.exceptions || [];
      
      // 清空列表
      exceptionsList.innerHTML = '';
      
      if (exceptions.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无例外网站';
        exceptionsList.appendChild(emptyMessage);
      } else {
        // 添加每个例外网站到列表
        exceptions.forEach(function(site) {
          addExceptionToList(site);
        });
      }
    });
  }
  
  // 添加例外网站到存储
  function addException(site) {
    chrome.storage.sync.get(['exceptions'], function(data) {
      const exceptions = data.exceptions || [];
      
      // 检查是否已存在
      if (exceptions.includes(site)) {
        alert('该网站已在例外列表中');
        return;
      }
      
      // 添加到列表
      exceptions.push(site);
      chrome.storage.sync.set({ exceptions: exceptions }, function() {
        // 更新UI
        addExceptionToList(site);
      });
    });
  }
  
  // 从存储中删除例外网站
  function removeException(site) {
    chrome.storage.sync.get(['exceptions'], function(data) {
      const exceptions = data.exceptions || [];
      const index = exceptions.indexOf(site);
      
      if (index !== -1) {
        exceptions.splice(index, 1);
        chrome.storage.sync.set({ exceptions: exceptions }, function() {
          // 重新加载列表
          loadExceptions();
        });
      }
    });
  }
  
  // 添加例外网站到UI列表
  function addExceptionToList(site) {
    // 如果是第一个例外网站，清空"暂无例外网站"消息
    const emptyMessage = exceptionsList.querySelector('.empty-message');
    if (emptyMessage) {
      exceptionsList.removeChild(emptyMessage);
    }
    
    const item = document.createElement('div');
    item.className = 'exception-item';
    
    const icon = document.createElement('span');
    icon.className = 'site-icon';
    icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
    
    const siteText = document.createElement('span');
    siteText.className = 'site-text';
    siteText.textContent = site;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = '删除';
    deleteBtn.addEventListener('click', function() {
      if (confirm(`确定要从例外列表中删除 ${site} 吗？`)) {
        removeException(site);
      }
    });
    
    item.appendChild(icon);
    item.appendChild(siteText);
    item.appendChild(deleteBtn);
    
    exceptionsList.appendChild(item);
  }
});