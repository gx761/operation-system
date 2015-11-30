'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  db: {
    mongo: {
      uri:'mongodb://localhost/trdBoss',
      options:{ server: { socketOptions: { keepAlive: 1 } } }
    },
    mysql: {
      host: '172.16.45.254',
      connectionLimit: 10,
      user: 'cooxm',
      password: 'cooxm',
      port: 3306,
      database: 'integrated_db'
    }
  },
  redis: {
    port: 6379,
    host: '127.0.0.1',
    options: {
      return_buffers: false
    }
  },

};
