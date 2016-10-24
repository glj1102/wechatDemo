var config = {
    enableCompression: true,
    database: {
        username: '',
        password: '',
        host    : 'localhost',
        dialect : 'sqlite', //'mysql' | 'mariadb' | 'sqlite' | 'postgres' | 'mssql',
        pool    : {
            max : 5,
            min : 0,
            idle: 10000
        },
        // SQLite only
        storage : 'data/pro_database.sqlite',
        logging : false
    },
    logger  : {
        level        : "info",
        dirName      : "/data/logs/nodejs", // e.g. /mnt/wtlog/nodejs/web
        filename     : "lc-festival-log.log",
        errorFileName: "lc-festival-error.log",
        maxsize      : 1024 * 1024 * 10
    },

    weixin: {
        app_id: "wx5fdf3c058cc165a1",
        app_secret: "f8436abf85ee6062e3e42a980ad17eea"
    }
};

module.exports = exports = config;