var Sequelize = require("sequelize");
module.exports = exports = function (sequelize) {
    return sequelize.define('user', {
        openid       : {
            type: Sequelize.STRING, primaryKey: true
        },
        unionid  : {
            type: Sequelize.STRING
        },
        nickname     : {
            type: Sequelize.STRING
        },
        sex   : {
            type: Sequelize.INTEGER
        },
        headimgurl  : {
            type: Sequelize.STRING
        },
        num: {
            type: Sequelize.INTEGER, default: 1
        },
        name : {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
};