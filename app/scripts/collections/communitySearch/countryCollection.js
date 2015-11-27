/*global define*/
OperationSystem.Collections=OperationSystem.Collections||{};
OperationSystem.Collections.communitySearch=OperationSystem.Collections.communitySearch||{};

(function(){
'use strict';
OperationSystem.Collections.communitySearch.CountryCollection = Backbone.Collection.extend({
        model: OperationSystem.Models.communitySearch.CountryModel,
        url: OperationSystem.app.API + 'api/ajax/countries',
    });


})();

