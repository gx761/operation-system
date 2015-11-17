/*global define*/

define([
    'jquery',
    'backbone',
    'views/headerView',
    'views/indexView',
    'views/loginView',
    'views/communitySearch/communitySearchView',
    'views/communityDetails/communityDetailsView',
    'views/o2oServices/o2oServicesView',
    'app'
], function($, Backbone, HeaderView, IndexView, LoginView, CommunitySearchView, CommunityDetailsView, O2oServicesView, app) {
    'use strict';

    var IndexRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'login': 'login',
            'community/:communityId': 'showServicesInfo',
            'publicservices': 'listPublicServices'
        },
        listPublicServices: function() {
            this.showHeader();
            this.showSearchBar();
            this.show(new O2oServicesView({}), {
                requiresAuth: true
            });
        },

        showServicesInfo: function(communityId) {
            this.showHeader();
            this.showSearchBar();
            this.show(new CommunityDetailsView({
                communityId: communityId
            }), {
                requiresAuth: true
            });
        },

        login: function() {

            if (this.communitySearchView) {
                this.communitySearchView.close();
                delete this.communitySearchView;
            }

            if (this.headerView) {
                this.headerView.close();
                delete this.headerView;
            }

            this.show(new LoginView({}),{withSidebar:false});
        },

        index: function() {

            //    $('#content').empty();
            this.showHeader();
            this.showSearchBar();

            this.show(new IndexView({}), {
                requiresAuth: true
            });

        },
        showHeader: function() {
            if (!this.headerView) {
                this.headerView = new HeaderView({});
                $('#header').html(this.headerView.render().el);

            }
        },
        showSearchBar: function() {

            if (!this.communitySearchView) {
                this.communitySearchView =new CommunitySearchView({}); 
                $('#side_bar').html( this.communitySearchView.render().el);
                 this.communitySearchView.populate();

            }
        },

        show: function(view, options) {

            // Close and unbind any existing page view
            if (this.currentView && _.isFunction(this.currentView.close)) {
                this.currentView.close();
            }
            // Re create the main div
            if (!document.getElementById('content')) {

                var content = document.createElement('div');
                content.setAttribute('id', 'content');
                content.setAttribute('class', 'container-fluid  withSidebar');

                document.getElementsByTagName('body')[0].insertBefore(content, document.getElementById('side_bar'));
            }

            if (typeof options.withSidebar!=='undefined'&& options.withSidebar===false) {
                    document.getElementById('content').setAttribute('class', 'container-fluid');
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