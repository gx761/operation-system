/*global require*/
'use strict';

window.OperationSystem = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function() {
        'use strict';
        OperationSystem.app.session = new OperationSystem.Models.SessionModel({});
        OperationSystem.app.router = new Backbone.Router();

        var indexRouter = new OperationSystem.Routers.IndexRouter({});


        OperationSystem.app.session.checkAuth({

            complete: function() {

                // HTML5 pushState for URLs without hashbangs
                var hasPushstate = !!(window.history && history.pushState);
                if (hasPushstate) {
                    Backbone.history.start({
                        pushState: false,
                        root: '/'
                    });
                } else {
                    Backbone.history.start();
                }

            }
        });


    }
};

$(document).ready(function() {
    'use strict';
    OperationSystem.init();
});


