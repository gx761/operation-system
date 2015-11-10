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
    'views/communityDetails/privateServicesView',
    'views/communityDetails/publicServicesView',
    
], function($, _, Backbone, JST,CommunityHeaderView,ServicesView,McompanyModel,PrivateServiceCollection,PrivateServicesView,PublicervicesView) {
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
        populateHeader:function(){
            var mcompanyModel,
                commmunityHeader;

            mcompanyModel = new McompanyModel({
            });
            
            mcompanyModel.set('communityId',this.communityId);

            commmunityHeader= new CommunityHeaderView({
                el:'#community_header',
                model:mcompanyModel
            });

            mcompanyModel.fetch();
        },

        populatePrivateServices:function(){
            var privateServiceCollection,
                privateServicesView;
                
            privateServiceCollection = new PrivateServiceCollection({});
                
            privateServiceCollection.url='/api/services/privateServices/'+this.communityId;

         

            privateServicesView = new PrivateServicesView({
                el:'#private_services',
                collection:privateServiceCollection,
                communityId:this.communityId
            });

            privateServiceCollection.fetch({reset:true});
        },
        
        populate: function() {
            this.populateHeader();

            this.populatePrivateServices();





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
          
            this.$el.append(this.template({}));
            this.populate();
            return this;
        }
    });

    return CommunityDetailsView;
});