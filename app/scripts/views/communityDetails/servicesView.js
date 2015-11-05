/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',

], function ($, _, Backbone, JST) {
    'use strict';

    var ServicesView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/services.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
        //    this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    return ServicesView;
});
