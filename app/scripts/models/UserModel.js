/*global define*/

OperationSystem.Models =OperationSystem.Models||{};

(function(){
'use strict';

OperationSystem.Models.UserModel = Backbone.Model.extend({
        url: OperationSystem.app.API+"/api/users/me",

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

})();

