/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communitySearch=OperationSystem.Collections.communitySearch||{};

(function(){
'use strict';
OperationSystem.Collections.communitySearch.ProvinceCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communitySearch.ProvinceModel
    });

})();