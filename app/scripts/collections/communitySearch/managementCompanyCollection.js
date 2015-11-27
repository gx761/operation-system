/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communitySearch=OperationSystem.Collections.communitySearch||{};

(function(){
'use strict';
OperationSystem.Collections.communitySearch.ManagementCompanyCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communitySearch.ManagementCompanyModel,
        url: OperationSystem.app.API + 'api/ajax/companies',
    });


})();




