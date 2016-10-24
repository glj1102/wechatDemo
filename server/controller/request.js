var Base = require("./base"),
    util = require("util"),
    constant = require("../core/constant"),
    wtutil = require("../core/wtutil"),
    _ = require("lodash"),
    moment = require("moment"),
    request = require("request"),
    sign = require("./sign"),
    crypto = require("crypto"),
    xml2js = require("xml2js");
var Request = function (config, logger, data) {
    Base.call(this, config, logger, data);


    Request.prototype.weixinSign = function (req, res) {
        var url = req.query.url;
        wtutil.get_token(function (err, obj) {
            wtutil.get_ticket(obj.access_token, function (ticket) {
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
            getuser(JSON.parse(b), function (err, obj) {
                if (!obj) {
                    return res.send({code: 401});
                }
                return res.send(obj);
            });
        });
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

    Request.prototype.receive = function (req, res, next) {
        // 在这接收消息
        var xml = '';
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            xml += chunk;
        });
        req.on('end', function () {
            toJSON(xml, res);
        });
    };

    Request.prototype.check = function (req, res, next) {
        // 在这里验证签名
        var signature = req.query['signature'],
            timestamp = req.query['timestamp'],
            nonce = req.query['nonce'],
            echostr = req.query['echostr'];
        var sha1 = crypto.createHash('sha1'),
            sha1Str = sha1.update([config.weixin.token, timestamp, nonce].sort().join('')).digest('hex');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end((sha1Str === signature) ? echostr : '');
        return res;
    };

    //解析器
    var toJSON = function (xml, res) {
        var msg = {};
        xml2js.parseString(xml, function (err, result) {
            var data = result.xml;
            msg.ToUserName = data.ToUserName[0];
            msg.FromUserName = data.FromUserName[0];
            msg.CreateTime = data.CreateTime[0];
            msg.MsgType = data.MsgType[0];
            switch (msg.MsgType) {
                case 'text' :
                    msg.Content = data.Content[0];
                    msg.MsgId = data.MsgId[0];
                    handle_text(msg, res);
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'image' :
                    msg.PicUrl = data.PicUrl[0];
                    msg.MsgId = data.MsgId[0];
                    msg.MediaId = data.MediaId[0];
                    console.log(msg)
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'voice' :
                    msg.MediaId = data.MediaId[0];
                    msg.Format = data.Format[0];
                    msg.MsgId = data.MsgId[0];
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'video' :
                    msg.MediaId = data.MediaId[0];
                    msg.ThumbMediaId = data.ThumbMediaId[0];
                    msg.MsgId = data.MsgId[0];
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'location' :
                    msg.Location_X = data.Location_X[0];
                    msg.Location_Y = data.Location_Y[0];
                    msg.Scale = data.Scale[0];
                    msg.Label = data.Label[0];
                    msg.MsgId = data.MsgId[0];
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'link' :
                    msg.Title = data.Title[0];
                    msg.Description = data.Description[0];
                    msg.Url = data.Url[0];
                    msg.MsgId = data.MsgId[0];
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
                case 'event' :
                    msg.Event = data.Event[0];
                    if (data.EventKey && _.isArray(data.EventKey) && data.EventKey.length > 0) {
                        msg.EventKey = data.EventKey[0];
                        handle_event(msg, res);
                    }
                    res.setHeader("Content-Type", "text/plain");
                    return res.send("");
                    break;
            }
        });
    };

    var handle_text = function (msg, res) {
        var text = msg.Content;
        if(text.trim() == "研发"){
            var data = {
                "touser":msg.FromUserName,
                "msgtype":"news",
                "news":{
                    "articles": [
                        {
                            "title":"重磅！Worktile 推出研发管理解决方案",
                            "description":"项目进度清晰掌握，快速跟进产品Bug，多维度统计报表，文件文档有序管理",
                            "url":"https://pro.worktile.com/solution/dev",
                            "picurl":"https://wt-prj.oss.aliyuncs.com/b327e3a5666048279583e8e026ac6b87/4bb6e53c-8516-4466-b278-4f3b596e46db.png"
                        }
                    ]
                }
            };
            sendMessageToUser(data);
        }else if(text.trim() == "电商"){
            var data = {
                "touser":msg.FromUserName,
                "msgtype":"news",
                "news":{
                    "articles": [
                        {
                            "title":"Worktile 『电商解决方案』上线！",
                            "description":"降低运营成本，提高团队效率。日常运营、大促筹备、售后跟踪、研发管理……尽在掌握。",
                            "url":"https://pro.worktile.com/solution/ecommerce",
                            "picurl":"https://cdn.worktile.com/solution/ecommerce.png"
                        }
                    ]
                }
            };
            sendMessageToUser(data);
        }
    };
    var handle_event = function (msg, res) {
        console.log("weixin receive message ===", msg)
        if (msg.Event == 'CLICK' && msg.EventKey == 'work_together') {
            var text = "hello，谢谢对 Worktile 的关注啦，请访问worktile官方网站了解。。。。。";
            var data = {
                touser : msg.FromUserName,
                msgtype: "text",
                text   : {
                    content: text
                }
            };
            sendMessageToUser(data);
        }
    };

    var sendMessageToUser = function ( data) {
        wtutil.get_token(function (err, obj) {
            request.post({
                url    : "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + obj.access_token,
                headers: {"Content-Type": "application/json"},
                json   : data
            }, function (err, res, body) {
            })
        });
    };

    Request.prototype.qrcode = function(req, res){
        wtutil.get_token(function (err, obj) {
            request.post({
                url : "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=" + obj.access_token,
                json: {"action_name": "QR_LIMIT_STR_SCENE", "action_info": {"scene": {"scene_str": "自定义参数"}}}
            }, function (err, r, b) {
                if (b.errcode && b.errcode == 40001) {
                    console.log(b);
                } else {
                    res.writeHead(200, {"Content-Type": "image/jpg"});
                    var stream = request.get("https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + encodeURIComponent(b.ticket));
                    stream.pipe(res);
                }
            });
        });
    };

};

util.inherits(Request, Base);
module.exports = exports = Request;