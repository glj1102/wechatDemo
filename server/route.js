/*global module,require*/
var ctrl = require("./controller"),
    util = require("util"),
    handler = require("./handler"),
    express = require("express"),
    bodyParser = require('body-parser');

exports = module.exports = function (app, config, logger) {
    handler = new handler(config, logger);
    ctrl = ctrl(config, logger);


};