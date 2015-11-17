/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/o2oServices/listCommunitiesView',
    'views/o2oServices/editO2oServiceView',
    'collections/communitySearch/communityCollection',
], function($, _, Backbone, JST, ListCommunitiesView, EditO2oServiceView,CommunityCollection) {
    'use strict';

    var O2oServiceDetailsView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/o2oServices/o2oServiceDetails.ejs'],


        events: {
            'click .expand_panel:not(.active)': 'togglePanel'
        },

        initialize: function(options) {
            this.communityId = options.communityId;
            _.bindAll(this);

        },

        togglePanel: function(e) {
            var clickElement = e.currentTarget;
            var contents= $('.tab-contents');

            clickElement = $(clickElement);

            clickElement.parent().children('.expand_panel.active').removeClass('active');

            clickElement.addClass('active');

            if(clickElement.hasClass('showEditService')){
                contents.css({top:'-452px'});
            }
            else{
                contents.css({top:'0px'});
            }   

        },
        populateCommunities: function() {

            var communityCollection = new CommunityCollection({});
            communityCollection.url = 'api/services/o2oServices/' + this.model.id + '/communities';
            var listCommunitiesView = new ListCommunitiesView({
                el: '#service_communities',
                collection: communityCollection
            });
            communityCollection.fetch({
                reset: true
            });

        },
        populateService: function() {

            var editO2oServiceView = new EditO2oServiceView({
                el:'#edit_service',
                model:this.model,
            });

            editO2oServiceView.parentView = this;

            editO2oServiceView.render();

        },
        render: function() {

            this.$el.html(this.template(this.model.toJSON()));
           this.showModal();

            this.populateCommunities();
            this.populateService();


            return this;
        }
    });

    return O2oServiceDetailsView;
});