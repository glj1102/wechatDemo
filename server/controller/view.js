var Base = require("./base"),
    constant = require("../core/constant"),
    wtutil = require("../core/wtutil"),
    _ = require("lodash"),
    util = require('util'),
    moment = require("moment"),
    request = require("request"),
    sign = require("./sign");

var View = function (config, logger, data) {
    Base.call(this, config, logger, data);

    View.prototype.index = function (req, res) {
        res.render("index", {});
    };

    View.prototype.jssdk = function (req, res) {
        res.render("jssdk", {});
    };

    View.prototype.profile = function (req, res) {
        var code = req.query.code;
        if (code) {
            var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.weixin.app_id + "&secret=" + config.weixin.app_secret + "&code=" + code + "&grant_type=authorization_code";
            request.get(url, function (err, r, b) {
                if (JSON.parse(b).errcode || !JSON.parse(b).openid) {
                    return res.send({code: 401});
                }
                getuser(JSON.parse(b), function (err, obj) {
                    if (!obj) {
                        return res.send({code: 401});
                    }
                    return res.send(obj);
                });
            });
        } else {
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.weixin.app_id + "&redirect_uri=http://wechattest.worktile.com/profile&response_type=code&scope=snsapi_userinfo";
            return res.redirect(url);
        }
    };

    var getuser = function (tokenobj, fn) {
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + tokenobj.access_token + "&openid=" + tokenobj.openid + "&lang=zh_CN";
        request.get(url, function (err, r, b) {
            try {
                var user = JSON.parse(b);
                return fn(err, user);
            } catch (e) {
                return fn("error");
            }
        });
    };

};

util.inherits(View, Base);
module.exports = exports = View;