/*global define*/

define([
    'underscore',
    'backbone',

], function (_, Backbone) {
    'use strict';

    var PrivateServiceModel = Backbone.Model.extend({
        urlRoot: 'api/services/privateServices',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            if(options.parse){
                return response;
            }

        }
    });

    return PrivateServiceModel;
});
