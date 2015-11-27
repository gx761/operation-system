/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communityDetails=OperationSystem.Collections.communityDetails||{};

(function(){
    'use strict';
    OperationSystem.Collections.communityDetails.PrivateServiceCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communityDetails.PrivateServiceModel,

    });
})();

