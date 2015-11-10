/*global define*/

define([
    'jquery',
    'backbone',
    'views/headerView',
    'views/indexView',
    'views/loginView',
    'views/communitySearch/communitySearchView',
    'views/communityDetails/communityDetailsView',
    'app'
], function($, Backbone, HeaderView, IndexView, LoginView, CommunitySearchView, CommunityDetailsView,app) {
    'use strict';

    var IndexRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'login': 'login',
             'community/:communityId': 'showServicesInfo'
        },
         showServicesInfo: function(communityId) {

            //   $('#content').empty();
            this.showHeader();
            this.showSearchBar();
            this.show(new CommunityDetailsView({
                communityId: communityId
            }), {
                requiresAuth: true
            });

        },
        login: function() {

            this.show(new LoginView({}));

        },
        index: function() {

            $('#content').empty();
            this.show(new IndexView({}), {
                requiresAuth: true
            });
            this.showHeader();
            this.showSearchBar();
        },
        showHeader: function() {
            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($('#header')).render();
            }
        },
        showSearchBar: function() {

            if (!this.communitySearchView) {
                this.communitySearchView = new CommunitySearchView({}).setElement('#side_bar').render();
            }
        },

        show: function(view, options) {

            // Close and unbind any existing page view
            if (this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();
            // Re create the main div
            if(!document.getElementById('content')){

                var content= document.createElement('div');
                content.setAttribute('id', 'content');
                content.setAttribute('class', 'container-fluid ');

                document.getElementsByTagName('body')[0].insertBefore(content,document.getElementById('side_bar'));
            }

            // Establish the requested view into scope
            this.currentView = view;


            if (typeof options !== 'undefined' && options.requiresAuth) {

                var self = this;
                app.session.checkAuth({
                    success: function(res) {
                        // If auth successful, render inside the page wrapper
                       // $('#content').html(self.currentView.render().$el);
                        self.currentView.setElement('#content').render();
                    },
                    error: function(res) {
                        console.log('index router auth fail');
                        self.navigate('login', {
                            trigger: true,
                            replace: true
                        });
                    }
                });

            } else {
                // Render inside the page wrapper
             //   $('#content').html(this.currentView.render().$el);
                this.currentView.setElement('#content').render();
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }


        }

    });

    return IndexRouter;
});