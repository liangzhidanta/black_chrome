# Black Chrome 🌓

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/black-chrome)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)

> 简洁高效的夜间浏览体验 ✨

## 📖 简介

Black Chrome 是一款简洁而强大的 Chrome 浏览器扩展，为您提供舒适的夜间浏览体验。通过智能调整网页颜色和亮度，减轻眼睛疲劳，让您在夜间浏览网页时更加舒适。

![Black Chrome 预览](https://via.placeholder.com/640x400?text=Black+Chrome+预览)

## ✨ 主要功能

- 🌙 **智能暗色模式**：一键切换网页为暗色模式，保护您的眼睛
- 🔆 **亮度调节**：根据环境和个人喜好自由调节屏幕亮度
- 🔍 **网站例外列表**：为特定网站设置例外，不应用暗色模式
- 🚀 **高性能**：优化的代码确保浏览体验流畅无卡顿
- 🔄 **实时切换**：无需刷新页面即可应用或取消暗色模式
- 🔒 **隐私保护**：完全在本地运行，不收集任何用户数据

## 🔧 安装方法

### 从 Chrome 网上应用店安装

1. 访问 [Chrome 网上应用店](https://chrome.google.com/webstore/category/extensions)（即将上线）
2. 搜索 "Black Chrome"
3. 点击 "添加至 Chrome"

### 开发者模式安装

1. 下载此仓库并解压
2. 打开 Chrome 浏览器，进入扩展程序页面 `chrome://extensions/`
3. 开启右上角的 "开发者模式"
4. 点击 "加载已解压的扩展程序"
5. 选择解压后的文件夹

## 🎮 使用指南

### 基本使用

1. 点击浏览器工具栏中的 Black Chrome 图标
2. 使用开关按钮启用/禁用暗色模式
3. 使用亮度滑块调整屏幕亮度

### 设置网站例外

1. 点击浏览器工具栏中的 Black Chrome 图标
2. 点击 "网站例外列表"
3. 点击 "+ 添加网站" 按钮添加不需要应用暗色模式的网站

## 🔍 技术实现

- 使用 Chrome Extension Manifest V3
- 通过 CSS 注入实现暗色模式
- 使用 Chrome Storage API 保存用户设置
- 响应式设计，适配各种屏幕尺寸
- 智能元素识别，避免深色模式覆盖不应修改的元素

## 🌐 网站兼容性

我们提供了网站兼容指南，帮助网站开发者更好地适配深色模式。详情请查看 [WEBSITE_GUIDE.md](./WEBSITE_GUIDE.md) 文件。

### 主要特性

- 支持网站通过添加 `no-dark-mode` 类或 `data-theme="light"` 属性排除元素
- 自动识别并排除视频播放器、媒体元素、编辑器等特殊内容
- 智能处理图片和图标，避免不必要的亮度调整

## 🤝 贡献指南

欢迎为 Black Chrome 做出贡献！您可以通过以下方式参与：

1. 报告 Bug
2. 提交新功能建议
3. 提交代码改进
4. 完善文档

## 📜 许可证

本项目采用 [MIT 许可证](LICENSE)。


---

⭐ 如果您喜欢这个扩展，请在 GitHub 上给我们一个星标！
