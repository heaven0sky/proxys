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

function init() {
    chrome.tabs.create({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function (tab) {
        cur_tab = tab.id;
    });

    setTimeout(function(){
        run();
        setTimeout(arguments.callee,5000);
    },5000)
}


function run() {
    if (ips.length > 0) {
        var ip = ips.pop();
        var row = ip.split(":");
        if (row.length === 2) {
            console.log(ip);
            set_proxy(row[0], row[1]);
            chrome.cookies.getAll({url: "http://www.hao123.com/?tn=90384165_hao_pg"}, function (cookies) {
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    chrome.cookies.remove({
                        url: "http://www.hao123.com/?tn=90384165_hao_pg",
                        name: cookie.name
                    }, function () {
                    });
                }
            });
            chrome.tabs.reload(cur_tab, function() {});
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
            bypassList: ["127.0.0.1"]
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

function get_ips() {
    use_system_proxy();
    var request = $.ajax({
        url: api_url + '?time=' + Date.parse(new Date()),
        type:"GET",
        success: function (result) {
            var arrayOfLines = result.match(/[^\r\n]+/g);
            for (var i = 0; i < arrayOfLines.length; i++) {
                var line = arrayOfLines[i];
                ips.push(line);
            }
        },
        complete: function(xhr, ts){
            xhr = null;
        },
        timeout: 4000 //in milliseconds
    });

    request.onreadystatechange = noop;
    request.abort = noop;
    request = null;
}

$(document).ready(function () {
    chrome.browserAction.onClicked.addListener(function () {
        init();
    });
});