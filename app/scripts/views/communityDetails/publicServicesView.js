/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/publicServiceView'
], function($, _, Backbone, JST,PublicServiceView) {
    'use strict';

    var PublicServicesView = Backbone.View.extend({
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

            var publicServiceView = new PublicServiceView({
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

    return PublicServicesView;
});