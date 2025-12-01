// ==UserScript==
// @name         GitHub 下载加速
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  检测多个代理节点与原站的延迟，自动使用最快的节点下载github资源
// @author       NikoYomi & Gemini
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_xmlhttpRequest
// @connect      mirror.ghproxy.com
// @connect      ghproxy.net
// @connect      gh-proxy.com
// @connect      github.moeyy.xyz
// @connect      github.snty.de
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const PROXY_CONFIG = [
        { name: "GhProxy (通用)", url: "https://mirror.ghproxy.com/" },
        { name: "GhProxy (Net)",  url: "https://ghproxy.net/" },
        { name: "GH-Proxy",       url: "https://gh-proxy.com/" },
        { name: "Moeyy (日本)",   url: "https://github.moeyy.xyz/" },
    // 按照格式 { name: "名称",   url: "节点地址" }, 添加你收集或创建的任意加速节点
    ];

    const TIMEOUT_MS = 3000;      // 测速超时时间
    const HIDE_DELAY_MS = 6000;   // 提示框停留时间
    // ===========================================

    // --- UI 提示框样式 ---
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 24px; right: 24px; z-index: 2147483647;
        background: #1f2328; color: #f0f6fc; padding: 12px 24px;
        border-radius: 6px; font-size: 14px; display: none;
        box-shadow: 0 8px 24px rgba(1,4,9,0.5); border: 1px solid #30363d;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
        transition: opacity 0.5s ease-in-out, background-color 0.3s;
        opacity: 0;
    `;
    document.body.appendChild(toast);

    let hideTimer = null;

    // 显示提示 (支持自定义背景色)
    function showToast(htmlMsg, isErrorOrOriginal = false) {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        // 根据状态改变背景色
        // 红色: #d03538 (GitHub Error Red), 黑色: #1f2328 (默认)
        toast.style.background = isErrorOrOriginal ? '#d03538' : '#1f2328';
        toast.style.borderColor = isErrorOrOriginal ? '#d03538' : '#30363d';

        toast.innerHTML = htmlMsg;
        toast.style.display = 'block';
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
    }

    function hideToastDelayed() {
        hideTimer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.style.opacity === '0') {
                    toast.style.display = 'none';
                }
            }, 500);
        }, HIDE_DELAY_MS);
    }

    // --- 测速核心逻辑 ---
    function checkConnectivity(proxyObj, targetPath) {
        return new Promise((resolve, reject) => {
            // 如果是原站(isOriginal=true)，直接用 targetPath，不拼接 url
            const fullUrl = proxyObj.isOriginal ? targetPath : (proxyObj.url + targetPath);

            GM_xmlhttpRequest({
                method: "HEAD",
                url: fullUrl,
                timeout: TIMEOUT_MS,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 400) {
                        resolve({
                            name: proxyObj.name,
                            url: fullUrl,
                            isOriginal: proxyObj.isOriginal // 传递是否为原站的标记
                        });
                    } else {
                        reject('Status Error');
                    }
                },
                onerror: function() { reject('Network Error'); },
                ontimeout: function() { reject('Timeout'); }
            });
        });
    }

    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        if (!link.href.includes('github.com')) return;
        if (PROXY_CONFIG.some(p => link.href.startsWith(p.url))) return;

        const href = link.href;

        if (href.includes('/releases/download/') ||
            href.includes('/archive/') ||
            href.includes('/raw/')) {

            e.preventDefault();
            e.stopPropagation();

            // 构造竞速列表：所有代理 + 原站
            // 给原站添加特殊标记 isOriginal: true
            const raceCandidates = [
                ...PROXY_CONFIG,
                { name: "GitHub 原站", url: "", isOriginal: true }
            ];

            showToast(`
                <div style="display:flex; align-items:center;">
                    <span style="margin-right:8px; animation: spin 1s linear infinite;">⏳</span>
                    <span>开始在 ${PROXY_CONFIG.length} 个节点中寻找最快节点...</span>
                </div>
            `); // 默认黑色背景

            const promises = raceCandidates.map(p => checkConnectivity(p, href));

            Promise.any(promises)
                .then(winner => {
                    // 判断胜出者是 原站 还是 代理
                    if (winner.isOriginal) {
                        // === 原站最快 (显示红色背景) ===
                        showToast(`
                            <div style="font-weight:bold; margin-bottom:4px;">⚡ Ops！原站速度最快</div>
                            <div style="font-size:12px; opacity:0.9;">直接下载...</div>
                        `, true); // true 触发红色背景
                    } else {
                        // === 代理最快 (显示默认黑色背景) ===
                        showToast(`
                            <div style="color:#3fb950; font-weight:bold; margin-bottom:4px;">✅ 已找到最快节点: ${winner.name}</div>
                            <div style="font-size:12px; opacity:0.8;">开始下载...</div>
                        `, false);
                    }

                    console.log(`[GitHub加速] 胜出: ${winner.name}`);

                    setTimeout(() => {
                        window.location.href = winner.url;
                        hideToastDelayed();
                    }, 500);
                })
                .catch(error => {
                    // === 全部失败 (显示红色背景) ===
                    showToast(`⚠️ 节点都超时啦！快去看看吧！`, true);
                    setTimeout(() => {
                        window.location.href = href;
                        hideToastDelayed();
                    }, 1000);
                });
        }
    }, true);
})();
