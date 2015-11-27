/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communityDetails = OperationSystem.Views.communityDetails ||{};

(function(){
    'use strict';

    OperationSystem.Views.communityDetails.SortServicesView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/communityDetails/sortServices.ejs'],

        events: {
            'click #close':'closeModal'
        },

        initialize: function() {
            //    this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
            this.listenTo(this.collection, 'reset', this.addAll);

        },
        closeModal:function(e){
            e.preventDefault();
            this.hideModal();
        },

        render: function() {

            this.$el.html(this.template({}));
            return this;
        },
        syncToService: function() {
            var allModels = this.collection.models;

            var groupedModels = _.groupBy(allModels, 'type');

            var postData={};
            postData.privateServiceData = [];
            postData.publicServiceData = [];

            _.each(groupedModels.private, function(model) {
                postData.privateServiceData.push(model.toJSON());

            });
            _.each(groupedModels.public, function(model) {
                postData.publicServiceData.push(model.toJSON());

            });

            console.log(postData);

            $.ajax({
                url: '/api/services/orderService',
                type: 'PUT',
                data: JSON.stringify(postData),
                contentType: 'application/json',
                success: function(data) {
                  console.log(data);

                },
                error: function(error) {

                }

            });



        },
        addOne: function(sortService) {

            var sortServiceView = new OperationSystem.Views.communityDetails.SortServiceView({
                model: sortService,
                overClass: 'over',
                parent: this
            });


            this.sortServiceViews.push(sortServiceView);
            this.sortableView.append(
                sortServiceView.render().el
            );

        },
        addAll: function() {
            _.each(this.sortServiceViews, function(sortServiceView) {
                sortServiceView.remove();
            });

            this.sortServiceViews = [];

            //   console.log(this.publicServiceViews);
            this.sortableView = this.$el.find('.sortable-view');
            this.collection.comparator = 'order';
            this.collection.sort();
            this.collection.each(this.addOne);
        },
    });

})();

