/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/communityHeaderView',
    'views/communityDetails/servicesView',
    'models/communityDetails/mcompanyModel',
    'collections/communityDetails/privateServiceCollection',
    'collections/communityDetails/publicServiceCollection',

    'views/communityDetails/privateServicesView',
    'views/communityDetails/publicServicesView',

], function($, _, Backbone, JST, CommunityHeaderView, ServicesView, McompanyModel, PrivateServiceCollection, PublicServiceCollection, PrivateServicesView, PublicServicesView) {
    'use strict';

    var CommunityDetailsView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/communityDetails.ejs'],

        id: '',

        className: 'communityDetails',

        events: {},

        initialize: function(options) {
            //      this.listenTo(this.model, 'change', this.render);
            this.communityId = options.communityId;
        },
        populateHeader: function() {
            var mcompanyModel,
                commmunityHeader;

            mcompanyModel = new McompanyModel({});

            mcompanyModel.set('communityId', this.communityId);

            commmunityHeader = new CommunityHeaderView({
                el: '#community_header',
                model: mcompanyModel
            });

            mcompanyModel.fetch();
        },

        populatePrivateServices: function() {
            var privateServiceCollection,
                privateServicesView;

            privateServiceCollection = new PrivateServiceCollection({});

            privateServiceCollection.url = '/api/services/privateServices/' + this.communityId;

            privateServicesView = new PrivateServicesView({
                el: '#private_services',
                collection: privateServiceCollection,
                communityId: this.communityId
            });

            privateServiceCollection.fetch({
                reset: true
            });
        },

        populatePublicServices: function() {
            var publicServicesCollection,
                publicServicesView;
            publicServicesCollection = new PublicServiceCollection({});
            publicServicesCollection.url = '/api/services/publicServices/' + this.communityId;

            publicServicesView = new PublicServicesView({
                el:'#public_services',
                collection:publicServicesCollection,
                communityId:this.communityId
            });

            publicServicesCollection.fetch({
                reset:true
            });

        },

        populate: function() {
            this.populateHeader();

            this.populatePrivateServices();
            this.populatePublicServices();


            // var privateServices = new ServicesView({});
            // var publicServices = new ServicesView({});
            // var privateServicesHtml =privateServices.render().$el;

            // privateServicesHtml.addClass('col-md-4');
            // var publicServicesHtml =publicServices.render().$el;
            // publicServicesHtml.addClass('col-md-8');

            // this.$el.find('.community_header').append(commmunityHeader.render().$el);
            // this.$el.find('.services_row').append(privateServicesHtml);
            // this.$el.find('.services_row').append(publicServicesHtml);



        },


        populateCommunityInfo: function() {


        },

        render: function() {
            //      this.$el.html(this.template(this.model.toJSON()));
            this.$el.html(this.template({}));
            this.populate();
            return this;
        }
    });

    return CommunityDetailsView;
});