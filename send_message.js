/**
 * Created by gonglinjie on 15-4-9.
 */
var request = require('request'),
    config = require('./server/config'),
    wtutil = require('./server/core/wtutil'),
    _ = require("lodash");

exports.run = function () {

    wtutil.get_token(function (err, obj) {
        //var text = "你好，这是一条消息，多谢支持...";
        //var data = {
        //    touser : "oy4hbwbd0MOMmn8aUtQWMcNxs8PI",
        //    msgtype: "text",
        //    text   : {
        //        content: text
        //    }
        //};
        var data = {
            touser : "oy4hbwbd0MOMmn8aUtQWMcNxs8PI",
            msgtype: "image",
            "image":
            {
                "media_id":"ZqQGrsR6ivb273zLApNfkEdAP3UI8nHJTJ9ekelfJ8OhKUF6UG-o6YbOBv4uWf4R"
            }
        };
        request.post({
            url    : "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + obj.access_token,
            headers: {"Content-Type": "application/json"},
            json   : data
        }, function (err, res, body) {
            console.log(body);
        })
    });
};
exports.run();
