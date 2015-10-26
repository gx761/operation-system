/*global require*/
'use strict';

require.config({
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'parsley':{
            deps:['jquery']
        },
        'js-cookie':{
            exports:'Cookies'
        }

    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        bootstrap: '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
        parsley : '../bower_components/parsleyjs/dist/parsley',
        'js-cookie': '../bower_components/js-cookie/src/js.cookie'
    }
});

require([
    'backbone',
    'app',
    'routes/loginRouter',
    'routes/indexRouter',
    'models/SessionModel'
], function (Backbone,app,LoginRouter,IndexRouter,SessionModel) {
   // Backbone.emulateHttp =true;
    app.router = new LoginRouter({});
    app.session = new SessionModel({});

    app.session.checkAuth({

        // Start the backbone routing once we have captured a user's auth status
        complete: function(){
            // HTML5 pushState for URLs without hashbangs
        /*    var hasPushstate = !!(window.history && history.pushState);
            if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' });
            else Backbone.history.start();*/
            Backbone.history.start({ pushState: false, root: '/' });

        }
    });

    var indexRouter = new IndexRouter({});





});
