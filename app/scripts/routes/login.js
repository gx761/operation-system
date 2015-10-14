/*global define*/

define([
	'jquery',
	'backbone',
	'views/header',
	'views/login'
], function($, Backbone) {
	'use strict';

	var LoginRouter = Backbone.Router.extend({
		routes: {
			"login": "login"
		},
		login: function() {
			this.show(new loginView({}));

		},
		show: function(view, options) {
			if (!this.headerView) {
				this.headerView = new HeaderView({});
				this.headerView.setElement($(".header")).render();
			}
			// Close and unbind any existing page view
			if (this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();

			// Establish the requested view into scope
			this.currentView = view;

			if (typeof options !== 'undefined' && options.requiresAuth){        
                var self = this;
                app.session.checkAuth({
                    success: function(res){
                        // If auth successful, render inside the page wrapper
                        $('#content').html( self.currentView.render().$el);
                    }, error: function(res){
                        self.navigate("/", { trigger: true, replace: true });
                    }
                });

            } else {
                // Render inside the page wrapper
                $('#content').html(this.currentView.render().$el);
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }


		}

	});

	return LoginRouter;
});