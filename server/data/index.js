var Sequelize = require("sequelize"),
    user = require("./user");

module.exports = exports = function (config) {
    var sequelize = new Sequelize("wechatdemo", config.database.username, config.database.password, {
        host   : config.database.host,
        dialect: config.database.dialect,
        pool   : config.database.pool,
        // SQLite only
        storage: config.database.storage,
        logging: config.database.logging
    });
    var User = new user(sequelize);

    User.sync({force: false});

};


