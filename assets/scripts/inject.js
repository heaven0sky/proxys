// 向页面注入JS
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    document.body.appendChild(temp);
    //document.head.insertBefore(temp, docuemnt.head.firstChild);
}

setTimeout("injectCustomJs('assets/scripts/content.js')", Math.random() * 2000);