/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var PrivateServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/privateService.ejs'],

        tagName: 'div',

        id: '',

        className: 'service_box col-xs-3',

        events: {},

        initialize: function () {
        //    this.listenTo(this.model, 'change', this.render);
        },

        render: function () {


            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        }
    });

    return PrivateServiceView;
});
