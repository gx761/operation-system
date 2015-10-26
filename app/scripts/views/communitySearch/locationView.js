/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {
    'use strict';

    var LocationView = Backbone.View.extend({

        tagName: 'option',

        className: '',

        events: {},

        initialize: function () {
            _.bindAll(this);
        },

        render: function () {
        //   console.log(this.model.get("areacode"));

            $(this.el).attr('value',this.model.get('areacode')).html(this.model.get('name'));
 //           console.log(this.el);

            return this;
        }
    });

    return LocationView;
});
