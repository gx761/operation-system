/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        bootstrap: '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap'
    }
});

require([
    'backbone',
    'routes/login',
    'app'
], function (Backbone,LoginRouter,app) {
    Backbone.emulateHttp =true;
    app.router = new LoginRouter({});
    app.session = new SessionModel({});

});
