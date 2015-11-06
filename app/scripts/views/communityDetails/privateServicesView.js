/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/privateServiceView',
    'views/communityDetails/createPrivateServiceView',
    'models/communityDetails/privateServiceModel'
], function($, _, Backbone, JST, PrivateServiceView,CreatePrivateServiceView,PrivateServiceModel) {
    'use strict';

    var PrivateServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/privateServices.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click .add_service': 'addService',
        },

        initialize: function() {
            _.bindAll(this);
            // var self = this;
            this.listenTo(this.collection, 'reset', this.addAll);
            // this.collection.on("reset", this.addAll);
        },

        addService:function(e){
            e.preventDefault();
            var createCommunityModel = new PrivateServiceModel({});
            var view = new CreatePrivateServiceView({
                model:createCommunityModel
            });
            view.render().showModal();

        },
        addOne: function(privateService) {

            var privateServiceView = new PrivateServiceView({
                model: privateService
            });

            this.privateServiceViews.push(privateServiceView);

            this.$el.find('.row').append(
                privateServiceView.render().el
            );
        },
        addAll: function() {

            this.$el.append('<p>物业自营<span class="center-text">' + this.collection.length + '个</span></p><div class="row"><div class="col-xs-3"><div class="add_service"><div class="add-service-inner"><div class="synbol">+</div><div class="add">添加</div></div></div></div></div>');



            _.each(this.privateServiceViews, function(privateServiceView) {
                privateServiceView.remove();
            });

            this.privateServiceViews = [];

         //   console.log(this.privateServiceViews);

            this.collection.each(this.addOne);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return PrivateServicesView;
});