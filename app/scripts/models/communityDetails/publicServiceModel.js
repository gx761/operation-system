/*global define*/

OperationSystem.Models=OperationSystem.Models||{};
OperationSystem.Models.communityDetails=OperationSystem.Models.communityDetails||{};
(function(){
    'use strict';
    OperationSystem.Models.communityDetails.PublicServiceModel = Backbone.Model.extend({
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



})();
