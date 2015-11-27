/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communitySearch=OperationSystem.Collections.communitySearch||{};

(function(){
'use strict';
OperationSystem.Collections.communitySearch.CommunityCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communitySearch.CommunityModel,
        url:OperationSystem.app.API + 'api/communities/'
    });


})();
