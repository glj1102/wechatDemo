var _ = require("lodash");

var config = {
    title: "Worktile Festival"
};

(function () {
    var env = process.env.NODE_ENV;
    switch ((env && env.toLowerCase()) || "") {
        case 'dev':
        case '':
        case 'development':
            config.env = 'development';
            break;
        case 'prod':
        case 'production':
            config.env = 'production';
            break;
        case 'test':
            config.env = 'test';
            env = 'test';
            break;
        default:
            throw new Error("The env (" + env + ") config does not exist.");
    }
    config.session = {
            session_key: "three_year_sid",
            session_host: ".worktile.com"
    };
    config.prizes = [
        {
            name: "Wohoo",
            type: 1,
            probability: 0.04,
            weight: 4000,
            section: [0, 4000]
        },
        {
            name: "杯子",
            type: 2,
            probability: 0.01,
            weight: 1000,
            section: [4000, 5000]
        },
        {
            name: "本子",
            type: 3,
            probability: 0.04,
            weight: 4000,
            section: [5000, 9000]
        },
        {
            name: "礼盒",
            type: 4,
            probability: 0.01,
            weight: 1000,
            section: [9000, 10000]
        },
        {
            name: "299优惠券",
            type: 5,
            probability: 0.35,
            weight: 35000,
            section: [10000, 45000]
        },
        {
            name: "1000优惠券",
            type: 6,
            probability: 0.15,
            weight: 15000,
            section: [45000, 60000]
        },
        {
            name: "没中奖",
            type: 7,
            probability: 0.40,
            weight: 40000,
            section: [60000, 100000]
        }
    ];
    config = _.merge(config, require("./" + config.env))
})();

module.exports = exports = config;