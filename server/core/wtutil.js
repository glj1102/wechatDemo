var uuid = require('node-uuid'),
    moment = require('moment'),
    shortid = require('shortid'),
    request = require('request'),
    cache = require('im-cache'),
    config = require('../config'),
    _ = require('lodash');

module.exports = exports = {

    guid: function () {
        var str = uuid.v4();
        var regex = new RegExp('-', 'g');
        str = str.replace(regex, '');
        return str;
    },

    shortId: function () {
        return shortid.generate();
    },

    getNow: function () {
        var now = moment();
        return now.valueOf();
    },

    objectToArray: function (obj) {
        return _.map(obj, function (value, key) {
            return {key: key, value: value}
        });
    },

    get_token: function(fn){
        var access_token = cache.get("access_token");
        if (access_token) {
            return fn(null, access_token)
        } else {
            request.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.weixin.app_id + "&secret=" + config.weixin.app_secret, function (err, response, body) {
                cache.set("access_token", JSON.parse(body), 7000 * 1000);
                return fn(err, JSON.parse(body));
            });
        }
    },

    get_ticket: function(access_token, fn){
        var ticket = cache.get("ticket");
        if (ticket) {
            return fn(ticket);
        } else {
            request.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", function (err, r, b) {
                cache.set("ticket", JSON.parse(b).ticket, 7000 * 1000);
                return fn(JSON.parse(b).ticket);
            });
        }
    }
};