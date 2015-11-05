/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/privateServiceView'
], function($, _, Backbone, JST, PrivateServiceView) {
    'use strict';

    var PrivateServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/privateServices.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function() {
            _.bindAll(this);
            // var self = this;
            this.listenTo(this.collection, 'reset', this.addAll);
            // this.collection.on("reset", this.addAll);
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

            this.$el.append('<p>物业自营<span class="center-text">' + this.collection.length + '个</span></p>');

            this.$el.append('<div class="row"></div>');

            _.each(this.privateServiceViews, function(privateServiceView) {
                privateServiceView.remove();
            });

            this.privateServiceViews = [];

            console.log(this.privateServiceViews);

            this.collection.each(this.addOne);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    return PrivateServicesView;
});