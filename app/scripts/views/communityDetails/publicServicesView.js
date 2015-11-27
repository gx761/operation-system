/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communityDetails = OperationSystem.Views.communityDetails ||{};

(function(){
    'use strict';
    OperationSystem.Views.communityDetails.PublicServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/publicServices.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function(options) {
             _.bindAll(this);

             this.communityId = options.communityId;
            //this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        render: function() {

             var numbers = this.collection.countBy(function(service){
                if(service.get('community_id')){
                    return 'active';
                }
                else{
                    return 'inactive';
                }
            });
        
            this.$el.html(this.template(numbers));
            return this;
        },
        addOne: function(publicService) {

            var publicServiceView = new OperationSystem.Views.communityDetails.PublicServiceView({
                model: publicService,
                communityId:  this.communityId
            });

            this.publicServiceViews.push(publicServiceView);

            this.$el.find('.service_boxs').append(
                publicServiceView.render().el
            );
        },
        addAll: function() {

           
            this.render();
            _.each(this.publicServiceViews, function(publicServiceView) {
                publicServiceView.remove();
            });

            this.publicServiceViews = [];

            //   console.log(this.publicServiceViews);

            this.collection.each(this.addOne);
        },
    });


})();

