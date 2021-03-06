/*global define*/

define([
    "app",
], function (app) {
    'use strict';

    var UserModel = Backbone.Model.extend({
        url: app.API+"/api/users/me",

        idAttribute:"_id",
        initialize: function() {
        },

        defaults: {
            _id:0,
            role:'',
            name:'',
            email:''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return UserModel;
});
