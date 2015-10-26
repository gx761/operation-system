/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var ProvinceModel = Backbone.Model.extend({

        idAttribute:"areacode",
        initialize: function() {
        },

        defaults: {
            areacode:0,
            name:'',
            level:''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return ProvinceModel;
});
