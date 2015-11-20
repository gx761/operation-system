/*global define*/

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var PublicServiceModel = Backbone.Model.extend({
        urlRoot: 'api/services/publicServices',

        initialize: function() {
              this.type='public';
        },

        defaults: {},

        validate: function(attrs, options) {},

        parse: function(response, options) {
            if (options.parse) {
                return response;
            }

        }
    });

    return PublicServiceModel;
});