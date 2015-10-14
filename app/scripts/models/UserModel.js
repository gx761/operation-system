/*global define*/

define([
    "app",
], function (app) {
    'use strict';

    var UserModel = Backbone.Model.extend({
        
        initialize: function() {
        },

        defaults: {
            id:0,
            username:'',
            name:'',
            email:''
        },
        url:function(){
            return app.API+"/user";
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return UserModel;
});
