/*global module,require*/
var ctrl = require("./controller"),
    util = require("util"),
    handler = require("./handler"),
    express = require("express"),
    bodyParser = require('body-parser');

exports = module.exports = function (app, config, logger) {
    handler = new handler(config, logger);
    ctrl = ctrl(config, logger);

    app.get("/", ctrl.view.index);
    app.get("/profile", ctrl.view.profile);
    app.get("/jssdk", ctrl.view.jssdk);

    app.get("/sign", ctrl.request.weixinSign);
    app.post('/weixin/receive', ctrl.request.receive);
    app.get('/weixin/receive', ctrl.request.check);
    app.get('/weixin/qrcode', ctrl.request.qrcode);
};