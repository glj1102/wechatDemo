var Request = require("./request"),
    View = require("./view");

module.exports = exports = function (config, logger) {
    var data = require("../data")(config);
    var request = new Request(config, logger, data),
        view = new View(config, logger, data);

    return {
        request: request,
        view: view
    }
};