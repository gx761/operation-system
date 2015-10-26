'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/angularfullstack-dev'
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
  },
};
