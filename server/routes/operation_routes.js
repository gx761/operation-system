/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/services', require('../api/service'));
  app.use('/api/ajax', require('../api/ajax'));
  app.use('/api/users', require('../api/user'));
  app.use('/api/communities', require('../api/community'));
  app.use('/auth', require('../auth'));

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
