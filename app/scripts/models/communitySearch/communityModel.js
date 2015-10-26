/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var CommunityModel = Backbone.Model.extend({
        url: '',

        initialize: function() {
        },

        idAttribute:"communitynamecode",
        defaults: {
            communitynamecode:'',
            communityname:'',
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return CommunityModel;
});
