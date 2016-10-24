/**
 * Created by gonglinjie on 15-4-9.
 */
var request = require('request'),
    config = require('./server/config'),
    wtutil = require('./server/core/wtutil'),
    _ = require("lodash");

exports.run = function () {

    wtutil.get_token(function (err, obj) {
        var data = {
            "touser"     : "oy4hbwbd0MOMmn8aUtQWMcNxs8PI",
            "template_id": "z6yV_lOIAM-LQbsrG-B3hTQvwt8_4Y3wVU2PH9UW16c",
            "url"        : "https://worktile.com",
            "topcolor"   : "#FF00FF",
            "data"       : {
                "first"   : {
                    "value": "测试哈哈哈，颜色可以自定义",
                    "color": "#33FF00"
                },
                "one": {
                    "value": "one",
                    "color": "#173177"
                },
                "two": {
                    "value": "two",
                    "color": "#FF0033"
                },
                "three": {
                    "value": "three",
                    "color": "#173177"
                },
                "remark"  : {
                    "value": "remark，了解更多详情，关注我。。。。",
                    "color": "#33FF00"
                }
            }
        };
        request.post({
            url    : "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + obj.access_token,
            headers: {"Content-Type": "application/json"},
            json   : data
        }, function (err, res, body) {
            console.log(body, "----")
        })
    });
};
exports.run();
