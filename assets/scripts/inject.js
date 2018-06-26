// 向页面注入JS
function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    document.head.appendChild(temp);
    //document.head.insertBefore(temp, docuemnt.head.firstChild);
}

injectCustomJs('assets/libs/jquery-3.2.1.min.js');
injectCustomJs('assets/scripts/content.js');