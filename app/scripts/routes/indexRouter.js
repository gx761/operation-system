/*global define*/

define([
    'jquery',
    'backbone',
    'views/headerView',
    'views/indexView',
    '../views/communitySearch/communitySearchView',
    'app'
], function ($, Backbone, HeaderView, IndexView, CommunitySearchView,app) {
    'use strict';

    var IndexRouter = Backbone.Router.extend({
        routes: {
            '': 'index'
        },
        index: function () {


           if(app.session.get('logged_in')===true){
            $('#content').empty();
            this.showHeader();
            this.showSearchBar();
            this.show(new IndexView({}));
           }

            
            
        },
        showHeader: function () {
            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($("#header")).render();
            }
        },
        showSearchBar: function () {

            if (!this.communitySearchView) {
                this.communitySearchView = new CommunitySearchView({}).setElement('#content').render();
            }
        },

        show: function (view, options) {

            // Close and unbind any existing page view
            if (this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();

            // Establish the requested view into scope
            this.currentView = view;

            if (typeof options !== 'undefined' && options.requiresAuth) {
                var self = this;
                app.session.checkAuth({
                    success: function (res) {
                        // If auth successful, render inside the page wrapper
                        $('#content').html(self.currentView.render().$el);
                    }, error: function (res) {
                        self.navigate("/", {trigger: true, replace: true});
                    }
                });

            } else {
                // Render inside the page wrapper
                $('#content').append(this.currentView.render().$el);
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }


        }

    });

    return IndexRouter;
});
