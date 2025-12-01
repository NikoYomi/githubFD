# 🚀 GitHub Download Accelerator (GitHub 下载加速脚本)

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
    点击下方的链接直接安装：

    [**👉 点击安装脚本 (Install Script)**](./githubfd.user.js)


## 🛠️ 使用说明

1.  打开任意 GitHub 项目页面。
2.  进入 **Releases** 页面，或者点击绿色的 **Code** -> **Download ZIP**。
3.  点击文件链接。
4.  脚本会自动拦截点击，并在设置节点中测速度。
5.  测速完成后（通常在 0.5s - 1s 内），会自动跳转到最快的链接开始下载。

## ⚙️ 配置代理节点

如果你想添加或删除代理节点，可以在脚本代码的 `PROXY_CONFIG` 区域修改：

```javascript
// ================= 配置区域 =================
const PROXY_CONFIG = [
    { name: "GhProxy (通用)", url: "[https://mirror.ghproxy.com/](https://mirror.ghproxy.com/)" },
    { name: "GhProxy (Net)",  url: "[https://ghproxy.net/](https://ghproxy.net/)" },
    // 在这里按格式添加你的代理...
];
