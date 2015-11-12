/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/privateServiceView',
    'views/communityDetails/createPrivateServiceView',
    'models/communityDetails/privateServiceModel'
], function($, _, Backbone, JST, PrivateServiceView, CreatePrivateServiceView, PrivateServiceModel) {
    'use strict';

    var PrivateServicesView = Backbone.View.extend({
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
            var createPrivateServiceModel = new PrivateServiceModel({});


            createPrivateServiceModel.set('community_id', this.communityId);

            var view = new CreatePrivateServiceView({
                model: createPrivateServiceModel,
                collection: this.collection
            });
            view.render().showModal();

        },
        addOne: function(privateService) {

            var privateServiceView = new PrivateServiceView({
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

    return PrivateServicesView;
});