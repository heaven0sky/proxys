var api_url = "http://127.0.0.1:5000/ips"
var ips = [];
var cur_tab_hao;
var cur_tab_sogou;
var flag = true;
var count = 0;

function init() {
    use_system_proxy();
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg", pinned: true, index: 0}, function (tab) {
        cur_tab_hao = tab.id;
    });
    chrome.tabs.create({url: "https://123.sogou.com/?11704", pinned: true, index: 1}, function (tab) {
        cur_tab_sogou = tab.id;
    });
    chrome.tabs.query({}, function (tabs){
        for(var i = 0; i < tabs.length; i++)
        {
            var tab = tabs[i];
            if((tab.id != cur_tab_hao) && (tab.id != cur_tab_sogou)) {
                chrome.tabs.remove(tab.id, function (){});
            }
        };
    });
    /*
    get_ips();
    setTimeout(function(){
        get_ips();
        chrome.tabs.query({}, function (tabs){
            tabs.forEach(tab => {
                console.log(tab.id);
                if((tab.id != cur_tab_hao) && (tab.id != cur_tab_sogou)) {
                    chrome.tabs.remove(tab.id, function (){});
                }
            });
        });
        setTimeout(arguments.callee,7000);
    },7000);
    */
}

function get_ips() {
    var request = $.ajax({
        url: api_url + '?time=' + Date.parse(new Date()),
        type:"GET",
        success: function (result) {
            if (result.length > 0) {
                var row = result.split(":");
                if (row.length === 2) {
                    console.log(result);
                    chrome.cookies.getAll({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function (cookies) {
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = cookies[i];
                            chrome.cookies.remove({
                                url: "http://www.hao123.com/?tn=90384165_hao_pg",
                                name: cookie.name
                            }, function () {});
                        }
                    });

                    chrome.cookies.getAll({url: "https://123.sogou.com/?11704"}, function (cookies) {
                        for (var i = 0; i < cookies.length; i++) {
                            var cookie = cookies[i];
                            chrome.cookies.remove({
                                url: "https://123.sogou.com/?11704",
                                name: cookie.name
                            }, function () {});
                        }
                    });
                    set_proxy(row[0], row[1]);
                    resizeWindow();
                    chrome.tabs.reload(cur_tab_hao, function(tab){});
                    chrome.tabs.reload(cur_tab_sogou, function(tab){});
                }
            }
        },
        complete: function(xhr, ts){
            xhr = null;
        },
        timeout: 10000 //in milliseconds
    });

    request.onreadystatechange = noop;
    request.abort = noop;
    request = null;
}

function set_proxy(ip, port) {
    var config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                host: ip,
                port: parseInt(port)
            },
            bypassList: ["127.0.0.1", "*.mogumiao.com"]
        }
    };
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function () {
        });
}

function use_system_proxy() {
    var config = {
        mode: "direct"
    };
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function () {
        });
}

var noop = function(){};

function getRandom(arr) {
    var len = arr.length;
    var i = Math.ceil(Math.random() * (len ))%len;
    return arr[i];
}

var user_agents = ["ozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5478.400 QQBrowser/10.1.1550.400",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36 QIHU 360SE", "Mozilla/5.0(Macintosh;U;IntelMacOSX10_6_8;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50",
"Mozilla/5.0(Windows;U;WindowsNT6.1;en-us)AppleWebKit/534.50(KHTML,likeGecko)Version/5.1Safari/534.50","Mozilla/5.0(compatible;MSIE9.0;WindowsNT6.1;Trident/5.0","Mozilla/4.0(compatible;MSIE8.0;WindowsNT6.0;Trident/4.0)",
"Mozilla/5.0(Macintosh;IntelMacOSX10.6;rv:2.0.1)Gecko/20100101Firefox/4.0.1", "Mozilla/5.0(WindowsNT6.1;rv:2.0.1)Gecko/20100101Firefox/4.0.1","Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;TencentTraveler4.0)",
"Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;Maxthon2.0)","Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1)","Mozilla/4.0(compatible;MSIE7.0;WindowsNT5.1;Trident/4.0;SE2.XMetaSr1.0;SE2.XMetaSr1.0;.NETCLR2.0.50727;SE2.XMetaSr1.0)"];

var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


function resizeWindow() {
    var width = 1024 + Math.ceil(Math.random() * 800);
    var height = 700 + Math.ceil(Math.random() * 400);
    chrome.windows.getCurrent({}, function(win) {
        chrome.windows.update(win.id, {width: width, height: height}, function (){});
    });   
}

$(document).ready(function () {
    init();

    var requestFilter = {
        urls: [
            "<all_urls>"
        ]
    };
    
    
    chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
        var headers = details.requestHeaders;
        
        localStorage['user-agent'] = getRandom(user_agents) + getRandom(arr);
        if( !localStorage['user-agent'] ) {
            return;
        }
        for(var i = 0, l = headers.length; i < l; ++i) {
            if( headers[i].name == 'User-Agent' ) {
                break;
            }
        }
        if(i < headers.length) {
            headers[i].value = localStorage['user-agent'];
        }
        return {requestHeaders: headers};
    }, requestFilter, ['requestHeaders','blocking']);
    
});