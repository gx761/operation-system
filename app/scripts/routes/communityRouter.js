/*global define*/

define([
    'jquery',
    'backbone',
    'views/headerView',
    'views/communitySearch/communitySearchView',
    'views/communityDetails/communityDetailsView',
    'app'
], function($, Backbone, HeaderView, CommunitySearchView, CommunityDetailsView, app) {
    'use strict';

    var CommunityRouter = Backbone.Router.extend({
        routes: {
            'community/:communityId': 'showServicesInfo'
        },
        showServicesInfo: function(communityId) {

         //   $('#content').empty();
            this.showHeader();
            this.showSearchBar();
            this.show(new CommunityDetailsView({
                communityId:communityId
            }),{requiresAuth:true});

        },
        showHeader: function() {
           // console.log((this.headerView));

            if (!this.headerView) {
                this.headerView = new HeaderView({});
                this.headerView.setElement($('#header')).render();
            }
        },
        showSearchBar: function() {

            // if(this.communitySearchView){
            //     this.communitySearchView.close();
            // }

            if (!this.communitySearchView) {
                this.communitySearchView = new CommunitySearchView({}).setElement('#side_bar').render();
            }
        },
        show: function(view, options) {

            // Close and unbind any existing page view
            if (this.currentView && _.isFunction(this.currentView.close)) this.currentView.close();
            if(!document.getElementById('content')){

                var content= document.createElement('div');
                content.setAttribute('id', 'content');
                content.setAttribute('class', 'container-fluid ');

                document.getElementsByTagName('body')[0].insertBefore(content,document.getElementById('side_bar'));
            }

            // Establish the requested view into scope
            this.currentView = view;
            var self=this;
            if (typeof options !== 'undefined' && options.requiresAuth) {
           
                app.session.checkAuth({
                    success: function(res) {
                        // If auth successful, render inside the page wrapper
                        //$('#content').html(self.currentView.render().$el);
                       // self.showSearchBar();

                        self.currentView.setElement('#content').render();
                    },
                    error: function(res) {
                        self.navigate('login', {
                            trigger: true,
                            replace: true
                        });
                    }
                });

            } else {
                // Render inside the page wrapper
                this.currentView.setElement('#content').render();
           //     $('#content').append(this.currentView.render().$el);
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }


        }

    });

    return CommunityRouter;
});