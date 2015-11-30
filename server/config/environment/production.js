'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080,

    // MongoDB connection options
    mongo: {
        uri: process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
        'mongodb://localhost/angularfullstack'
    },
    seedDB: true,
    dbOptions: {
        host: '127.0.0.1',
        //host: '120.24.81.226',
        connectionLimit: 10,
        user: 'cooxm',
        password: 'cooxm',
        port: 3306,
        database: 'cooxm_main'
    }
};