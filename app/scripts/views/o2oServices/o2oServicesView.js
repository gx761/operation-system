/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/communityDetails/publicServiceCollection',
    'models/communityDetails/publicServiceModel',
    'views/o2oServices/o2oServiceView',
    'views/o2oServices/createO2oServiceView'
], function($, _, Backbone, JST, PublicServiceCollection, PublicServiceModel,O2oServiceView,CreateO2oServiceView) {
    'use strict';

    var O2oServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/o2oServices/o2oServices.ejs'],


        id: '',

        className: '',

        events: {
             'click .add_service': 'addService',
        },

        initialize: function() {

            this.collection = new PublicServiceCollection({});

            this.collection.url = '/api/services/o2oServices/';

            this.listenTo(this.collection, 'reset', this.addAll);

            this.listenTo(this.collection, 'add', this.addOne);

            _.bindAll(this);
        },
        populate: function() {

            this.collection.fetch({
                reset: true
            });

        },
        addService:function(e){
            e.preventDefault();
            var createO2oServiceModel = new PublicServiceModel({});


            var view = new CreateO2oServiceView({
                model:createO2oServiceModel,
                collection:this.collection
            });
            view.render().showModal();

        },
        addOne: function(o2oService) {

            console.log(o2oService);

            var o2oServiceView = new O2oServiceView({
                model: o2oService
            });

            this.o2oServiceViews.push(o2oServiceView);

            this.$el.find('.o2o_services').append(
                o2oServiceView.render().el
            );
        },
        addAll: function() {

            this.$el.append('<p><strong>图灵猫公共O2O服务</strong><span class="center-text">' + this.collection.length + '个</span></p><div class="o2o_services highlight clearfix"><div class="service_box"><div class="add_service"><div class="add-service-inner"><div class="synbol">+</div><div class="add">添加</div></div></div></div></div>');

            _.each(this.o2oServiceViews, function(o2oServiceView) {
                o2oServiceView.remove();
            });

            this.o2oServiceViews = [];

            //   console.log(this.o2oServiceViews);

            this.collection.each(this.addOne);
        },

        render: function() {
          //  this.$el.html(this.template());

            this.populate();
            return this;
        }
    });

    return O2oServicesView;
});