/*global define*/
OperationSystem.Routers=OperationSystem.Routers||{};

(function(){
    'use strict';
    OperationSystem.Routers.IndexRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'login': 'login',
            'community/:communityId': 'showServicesInfo',
            'publicservices': 'listPublicServices'
        },
        listPublicServices: function() {
            this.showHeader();
            this.showSearchBar();
            this.show(new OperationSystem.Views.o2oServices.O2oServicesView({}), {
                requiresAuth: true
            });
        },

        showServicesInfo: function(communityId) {
            this.showHeader();
            this.showSearchBar();
            this.show(new OperationSystem.Views.communityDetails.CommunityDetailsView({
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

            this.show(new OperationSystem.Views.LoginView({}),{withSidebar:false});
        },

        index: function() {

            //    $('#content').empty();
            this.showHeader();
            this.showSearchBar();

            this.show(new OperationSystem.Views.IndexView({}), {
                requiresAuth: true
            });

        },
        showHeader: function() {
            if (!this.headerView) {
                this.headerView = new OperationSystem.Views.HeaderView({});
                $('#header').html(this.headerView.render().el);

            }
        },
        showSearchBar: function() {

            if (!this.communitySearchView) {
                this.communitySearchView =new OperationSystem.Views.communitySearch.CommunitySearchView({}); 
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
                OperationSystem.app.session.checkAuth({
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


})(); 

