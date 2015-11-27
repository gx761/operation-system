/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communityDetails = OperationSystem.Views.communityDetails ||{};

(function(){
    'use strict';
    OperationSystem.Views.communityDetails.PrivateServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/privateServices.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click .add_service': 'addService',
        },

        initialize: function(options) {
            _.bindAll(this);
            // var self = this;
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'add', this.addOne);
            //   this.listenTo(this.collection, 'remove', this.removeOne);
            // this.collection.on("reset", this.addAll);
            // 

            this.communityId = options.communityId;

        },

        addService: function(e) {
            e.preventDefault();
            var createPrivateServiceModel = new OperationSystem.Views.communityDetails.PrivateServiceModel({});


            createPrivateServiceModel.set('community_id', this.communityId);

            var view = new OperationSystem.Views.communityDetails.CreatePrivateServiceView({
                model: createPrivateServiceModel,
                collection: this.collection
            });
            view.render().showModal();

        },
        addOne: function(privateService) {

            var privateServiceView = new OperationSystem.Views.communityDetails.PrivateServiceView({
                model: privateService
            });

            this.privateServiceViews.push(privateServiceView);

            this.$el.find('.service_boxs').append(
                privateServiceView.render().el
            );
        },
        addAll: function() {


            this.render();

            _.each(this.privateServiceViews, function(privateServiceView) {
                privateServiceView.remove();
            });

            this.privateServiceViews = [];

            //   console.log(this.privateServiceViews);

            this.collection.each(this.addOne);
        },
        render: function() {



            this.$el.html(this.template({number:this.collection.length}));
            return this;
        },


    });


})();

