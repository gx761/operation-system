/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var ManagementStaffView = Backbone.View.extend({

        tagName: 'option',

        className: '',

        events: {},

        initialize: function () {
            _.bindAll(this);
        },

        render: function () {
            //   console.log(this.model.get("areacode"));

            $(this.el).attr('value',this.model.get('id')).html(this.model.get('name'));
            //           console.log(this.el);

            return this;
        }
    });

    return ManagementStaffView;
});
