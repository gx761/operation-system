/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communityDetails = OperationSystem.Views.communityDetails ||{};

(function(){
'use strict';
OperationSystem.Views.communityDetails.CommunityDetailsView= Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/communityDetails.ejs'],

        id: '',

        className: 'communityDetails',

        events: {
            'click .show_service_order':'showServiceOrder'
        },

        initialize: function(options) {
            //      this.listenTo(this.model, 'change', this.render);
            this.communityId = options.communityId;
        },

        showServiceOrder:function(){
            var arr1= [];
            var enabledPrivateServices = this.privateServiceCollection.where({status:'active'});
            var enabledPublicServices = this.publicServicesCollection.where({status:'active'});

            var serviceArray=arr1.concat(enabledPrivateServices,enabledPublicServices);
            var serviceCollection =new Backbone.Collection({
                model:Backbone.Model
            });

            serviceCollection.set(serviceArray);

            var sortServicesView = new OperationSystem.Views.communityDetails.SortServicesView({
                collection:serviceCollection
            });

            sortServicesView.render();
            serviceCollection.trigger('reset');
            sortServicesView.showModal();

        },

        populateHeader: function() {
            var mcompanyModel,
                commmunityHeader;

            mcompanyModel = new OperationSystem.Models.communityDetails.McompanyModel({});

            mcompanyModel.set('communityId', this.communityId);

            commmunityHeader = new OperationSystem.Views.communityDetails.CommunityHeaderView({
                el: '#community_header',
                model: mcompanyModel
            });

            mcompanyModel.fetch();
        },

        populatePrivateServices: function() {
            var privateServiceCollection,
                privateServicesView;

            this.privateServiceCollection = new OperationSystem.Collections.communityDetails.PrivateServiceCollection({});

            this.privateServiceCollection.url = '/api/services/privateServices/' + this.communityId;

            privateServicesView = new OperationSystem.Views.communityDetails.PrivateServicesView({
                el: '#private_services',
                collection: this.privateServiceCollection,
                communityId: this.communityId
            });

            this.privateServiceCollection.fetch({
                reset: true
            });
        },

        populatePublicServices: function() {
            var publicServicesCollection,
                publicServicesView;
            this.publicServicesCollection = new OperationSystem.Collections.communityDetails.PublicServiceCollection({});
            this.publicServicesCollection.url = '/api/services/publicServices/' + this.communityId;

            publicServicesView = new OperationSystem.Views.communityDetails.PublicServicesView({
                el:'#public_services',
                collection:this.publicServicesCollection,
                communityId:this.communityId
            });

            this.publicServicesCollection.fetch({
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

})();


