// 检测当前域名和协议
function getCurrentBaseUrl() {
    return window.location.origin + window.location.pathname.replace('/index.html', '').replace(/\/$/, '');
}

// 初始化页面
function initializePage() {
    const baseUrl = getCurrentBaseUrl();
    const domainDisplay = document.getElementById('domain-display');
    
    if (window.location.protocol === 'file:') {
        domainDisplay.textContent = '本地文件 (file://)';
        domainDisplay.style.color = '#ffc107';
    } else {
        domainDisplay.textContent = window.location.origin;
        domainDisplay.style.color = '#28a745';
    }

    // 更新所有完整URL显示
    updateFullUrls();
}

// 更新完整URL显示
function updateFullUrls() {
    const baseUrl = getCurrentBaseUrl();
    const fullUrlElements = document.querySelectorAll('.full-url');
    
    fullUrlElements.forEach(element => {
        const path = element.previousElementSibling.textContent;
        const fullUrl = baseUrl + '/' + path + '/';
        element.textContent = fullUrl;
    });
}

// 打开配置文件
function openConfig(path) {
    const baseUrl = getCurrentBaseUrl();
    const fullUrl = baseUrl + '/' + path;
    window.open(fullUrl, '_blank');
}

// 复制完整URL
function copyFullUrl(path) {
    const baseUrl = getCurrentBaseUrl();
    const fullUrl = baseUrl + '/' + path + '/';

    navigator.clipboard.writeText(fullUrl).then(function() {
        showToast('完整URL已复制到剪贴板!', '#28a745');
    }).catch(function(err) {
        console.error('复制失败: ', err);
        alert('复制失败，请手动复制URL: ' + fullUrl);
    });
}

// 显示提示消息
function showToast(message, color = '#28a745') {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    // 添加动画样式
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 3秒后移除提示
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage);

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchTerm = prompt('搜索 API 配置:');
        if (searchTerm) {
            const cards = document.querySelectorAll('.api-card');
            cards.forEach(card => {
                const title = card.querySelector('.api-title').textContent.toLowerCase();
                if (title.includes(searchTerm.toLowerCase())) {
                    card.style.background = '#fff3cd';
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    card.style.background = '#f8f9fa';
                }
            });
        }
    }
});
