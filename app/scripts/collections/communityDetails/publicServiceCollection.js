/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communityDetails=OperationSystem.Collections.communityDetails||{};

(function(){
'use strict';

OperationSystem.Collections.communityDetails.PublicServiceCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communityDetails.PublicServiceModel
    });

})();

