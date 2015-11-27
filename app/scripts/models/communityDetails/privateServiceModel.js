/*global define*/

OperationSystem.Models=OperationSystem.Models||{};
OperationSystem.Models.communityDetails=OperationSystem.Models.communityDetails||{};

(function(){
    'use strict';
    OperationSystem.Models.communityDetails.PrivateServiceModel = Backbone.Model.extend({
        urlRoot: 'api/services/privateServices',

        initialize: function() {
            this.type='private';
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



})();


