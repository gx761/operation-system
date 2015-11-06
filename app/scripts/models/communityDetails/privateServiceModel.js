/*global define*/

define([
    'underscore',
    'backbone',

], function (_, Backbone) {
    'use strict';

    var PrivateServiceModel = Backbone.Model.extend({
        url: 'api/services/privateServices',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return PrivateServiceModel;
});
