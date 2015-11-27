/*global define*/

OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communitySearch=OperationSystem.Collections.communitySearch||{};

(function(){
'use strict';
OperationSystem.Collections.communitySearch.CityCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communitySearch.CityModel,
    });


})();


