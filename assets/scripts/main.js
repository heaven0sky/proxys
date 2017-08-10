/*
 Copyright (c) 2011 Shyc2001 (http://twitter.com/shyc2001)
 This work is based on:
 *"Switchy! Chrome Proxy Manager and Switcher" (by Mohammad Hejazi (mohammadhi at gmail d0t com))
 *"SwitchyPlus" by @ayanamist (http://twitter.com/ayanamist)

 This file is part of SwitchySharp.
 SwitchySharp is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 SwitchySharp is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with SwitchySharp.  If not, see <http://www.gnu.org/licenses/>.
 */

var api_url = "http://dev.kuaidaili.com/api/getproxy/?orderid=910193246144239&num=100&b_pcchrome=1&b_pcie=1&b_pcff=1&protocol=2&method=2&an_an=1&an_ha=1&sep=1"
var ips = [];
var cur_tab;
function init() {
    get_ips();
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function(tab){
        cur_tab = tab.id;
    });

    setInterval(run, 40000);
}

function run() {
    if (ips.length > 0) {
        var ip = ips.pop();
        var row = ip.split(":");
        if(row.length === 2) {
            console.log(ip);
            set_proxy(row[0], row[1]);
            chrome.cookies.getAll({url:"http://www.hao123.com/?tn=90384165_hao_pg"}, function(cookies) {
                for(var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    chrome.cookies.remove({url:"http://www.hao123.com/?tn=90384165_hao_pg", name: cookie.name}, function() {});
                }
            });
            chrome.tabs.update(cur_tab, {url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function() {});
        }
    } else {
        get_ips();
    }
}

function set_proxy(ip, port) {
    var config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                host: ip,
                port: parseInt(port)
            },
            bypassList: ["*kuaidaili.com"]
        }
    };
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function() {});
}

function use_system_proxy() {
    var config = {
        mode: "direct"
    };
    chrome.proxy.settings.set(
        {value: config, scope: 'regular'},
        function() {});
}

function get_ips() {
    use_system_proxy();
    $.get(api_url, function(result){
        var arrayOfLines = result.match(/[^\r\n]+/g);
        for(var i = 0; i < arrayOfLines.length; i++) {
            var line = arrayOfLines[i];
            if(!line.startsWith('E')){
                ips.push(line);
            }
        }
    });
}

$(document).ready(function(){
    chrome.browserAction.onClicked.addListener(function(){
        init();
    });
});
