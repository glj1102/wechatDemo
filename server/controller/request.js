var Base = require("./base"),
    util = require("util"),
    constant = require("../core/constant"),
    lcUtil = require("../core/util"),
    _ = require("lodash"),
    moment = require("moment"),
    cache = require("im-cache"),
    request = require("request"),
    sign = require("./sign"),
    queryString = require('query-string');
var Request = function (config, logger, data) {
    Base.call(this, config, logger, data);


    var get_token = function (fn) {
        var access_token = cache.get("access_token");
        if (access_token) {
            return fn(null, access_token)
        } else {
            request.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.weixin.app_id + "&secret=" + config.weixin.app_secret, function (err, response, body) {
                cache.set("access_token", JSON.parse(body), 7000 * 1000);
                fn(err, JSON.parse(body));
            });
        }

    };

    var get_ticket = function (access_token, fn) {
        var ticket = cache.get("ticket");
        if (ticket) {
            return fn(ticket);
        } else {
            request.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", function (err, r, b) {
                cache.set("ticket", JSON.parse(b).ticket, 7000 * 1000);
                return fn(JSON.parse(b).ticket);
            });
        }

    };

    Request.prototype.weixinSign = function (req, res) {
        var url = req.query.url;
        get_token(function (err, obj) {
            get_ticket(obj.access_token, function (ticket) {
                var sign_obj = sign(ticket, url);
                return res.send({code: 200, data: sign_obj});
            });
        });
    };

    Request.prototype.auth = function (req, res) {
        var code = req.query.code;
        if (_.isEmpty(code)) {
            return res.send({code: 401});
        }
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.weixin.app_id + "&secret=" + config.weixin.app_secret + "&code=" + code + "&grant_type=authorization_code";
        request.get(url, function (err, r, b) {
            if (JSON.parse(b).errcode || !JSON.parse(b).openid) {
                return res.send({code: 401});
            }
            data.user.findById(JSON.parse(b).openid).then(function (dataUser) {
                if (dataUser && dataUser.dataValues) {
                    var user = dataUser.dataValues;
                    res.cookie(config.session.session_key, user.openid, {
                        expires : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        httpOnly: false,
                        path    : '/',
                        domain  : config.session.session_host
                    });
                    return res.send({code: 200, data: user});
                } else {
                    getuser(JSON.parse(b), function (err, obj) {
                        if(!obj){
                            return res.send({code: 401});
                        }
                        return res.send(obj);
                    });
                }
            });
        });
    };

    var getuser = function (tokenobj, fn) {
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + tokenobj.access_token + "&openid=" + tokenobj.openid + "&lang=zh_CN";
        request.get(url, function (err, r, b) {

            try {
                var user = JSON.parse(b);
                var obj = {
                    openid    : tokenobj.openid,
                    unionid   : user.unionid,
                    nickname  : user.nickname,
                    sex       : user.sex,
                    headimgurl: user.headimgurl,
                    createdAt : lcUtil.getNow(),
                    num       : 1,
                    phone     : "",
                    address   : ""
                };
                data.user.create(obj).then(function () {
                    console.log(obj, "===insert")
                    return fn(err, obj);
                });
            } catch (e) {
                return fn("error");
            }


        });
    };


};

util.inherits(Request, Base);
module.exports = exports = Request;