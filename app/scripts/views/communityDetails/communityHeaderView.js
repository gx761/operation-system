/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
], function ($, _, Backbone, JST) {
    'use strict';

    var CommunityHeaderView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/communityHeader.ejs'],

        className: 'col-md-12',

        events: {},

        initialize: function (options) {
      

            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
      
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return CommunityHeaderView;
});
