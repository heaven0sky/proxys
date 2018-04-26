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

var api_url = "http://127.0.0.1:5000/ips"
var ips = [];
var cur_tab;
var flag = true;
var count = 0;

function init() {
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function (tab) {
        cur_tab = tab.id;
    });

    setTimeout(function(){
        count += 1;
        if (count > 60) {
            count = 0;
            chrome.windows.getAll(null, function (windows) {
                for (var i = 0; i < windows.length; i++){
                    chrome.windows.remove(windows[i].id, function () {});
                }
                
            });
        } else {
            get_ips();
            setTimeout(arguments.callee,5000);
        }
    },5000)
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
                    set_proxy(row[0], row[1]);
                    chrome.tabs.reload(cur_tab, function() {});
                }
            }
        },
        complete: function(xhr, ts){
            xhr = null;
        },
        timeout: 5000 //in milliseconds
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

$(document).ready(function () {
    init();
});