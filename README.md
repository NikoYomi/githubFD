# 🚀 GitHubFD (GitHub 下载加速脚本)

一个基于 Tampermonkey (油猴) 的脚本，用于提高 GitHub Release、Archive (ZIP/TAR.GZ) 和 Raw 文件的下载成功率和速度。

![Version](https://img.shields.io/badge/Version-4.1-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 主要特性

* **⚡ 智能竞速**：点击下载时，脚本并发测试多个代理节点（如 GhProxy, Moeyy 等）与 GitHub 原站的连接速度。
* **🧠 原站优先**：如果 GitHub 原站速度比代理更快（例如挂了梯子或网络环境好），脚本会自动选择原站，避免绕远路。
* **🎨 交互友好**：
    * 右上角悬浮窗实时显示测速状态。
    * **绿色提示**：表示代理节点最快，已加速。
    * **红色提示**：表示原站最快，或网络异常，使用原始链接兜底。
* **👻 自动隐藏**：提示框在下载开始 6 秒后自动消失，不遮挡视线。
* **🛡️ 容错机制**：如果所有代理都超时，自动回退到原链接，确保文件能下载。

## 📥 安装方法

1.  **安装管理器**：
    请先确保你的浏览器安装了脚本管理器：
    * [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Safari)
    * [Violentmonkey](https://violentmonkey.top/) (Firefox)

2.  **安装脚本**：
    下载此脚本并上传Tampermonkey (油猴) 使用：

    [**👉 点击安装脚本 (Install Script)**](./githubfd.user.js)


## 🛠️ 使用说明

1.  打开任意 GitHub 项目页面。
2.  进入 **Releases** 页面，或者点击绿色的 **Code** -> **Download ZIP**。
3.  点击文件链接。
4.  脚本会自动拦截点击，并在设置节点中测速度。
5.  测速完成后（通常在 0.5s - 1s 内），会自动跳转到最快的链接开始下载。

## ⚙️ 配置代理节点

如果你想添加或删除代理节点，可以在脚本代码的 `PROXY_CONFIG` 区域修改：

## ⚙️ 配置代理节点

如果你想添加或删除代理节点，可以在脚本代码的 `PROXY_CONFIG` 区域修改：

```javascript
// ================= 配置区域 =================
const PROXY_CONFIG = [
    { name: "GhProxy (通用)", url: "https://mirror.ghproxy.com/" },
    { name: "少年听雨",       url: "https://github.snty.de/" },
    { name: "GhProxy (Net)",  url: "https://ghproxy.net/" },
    // 在这里按格式添加你的代理...
];

```

### 💡 进阶建议 (推荐)

虽然公共节点很方便，但为了获得更稳定、更私密的下载体验，**强烈推荐搭配此项目构建自己的加速节点**：

* **hunshcn/gh-proxy**: [https://github.com/hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy)

你可以在 Cloudflare Workers 等平台上免费部署，搭建完成后，只需将你的专属域名按照上面的格式添加到脚本的 `PROXY_CONFIG` 中即可。

## ❓ 常见问题 (FAQ)

**Q: 第一次运行时弹窗提示 "用户脚本试图访问跨源资源"？**
A: 这是油猴的安全机制，因为脚本需要向代理服务器发送测速请求。
* 请务必点击 **"总是允许此域名" (Always allow domain)**。
* 每个新的代理域名只需允许一次。

**Q: 为什么提示框显示红色？**
A: 红色代表当前网络环境下，**GitHub 原站的速度比所有代理都快**，或者代理全部超时。脚本明智地选择了直接下载，没有走代理。


## ⚠️ 免责声明

1.  本脚本仅供技术研究和学习使用。
2.  脚本中使用的代理节点均为第三方公共服务，脚本作者不对其可用性、安全性和隐私性负责。
3.  请勿在代理节点下载涉及机密或私有的代码仓库。

