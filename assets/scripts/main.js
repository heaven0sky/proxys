var cur_tab;
var ly_tab;
function init() {
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function(tab){
        cur_tab = tab.id;
    });

    chrome.tabs.create({url: "http://tplogin.cn/"}, function(tab){
        ly_tab = tab.id;
    });
    setInterval(run,20000);
    //setInterval(reload, 5000);
}

function run() {
    chrome.tabs.executeScript(ly_tab,{
        code: "var btn = document.getElementById('disconnect');btn.click();"
    });
    setTimeout("lianjie()",5000);
}

function lianjie() {
    chrome.tabs.executeScript(ly_tab,{
        code: "var btn = document.getElementById('save');btn.click();"
    });
}

function reload() {
    if(cur_tab !== null)
        chrome.tabs.remove(cur_tab, function(){});
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function(tab){
        cur_tab = tab.id;
    });
}

$(document).ready(function(){
    chrome.browserAction.onClicked.addListener(function(){
        init();
    });
});
