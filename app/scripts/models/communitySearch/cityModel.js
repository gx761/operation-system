/*global define*/

OperationSystem.Models=OperationSystem.Models||{};
OperationSystem.Models.communitySearch=OperationSystem.Models.communitySearch||{};

(function(){
    'use strict';
    OperationSystem.Models.communitySearch.CityModel = Backbone.Model.extend({

        idAttribute:"areacode",

        initialize: function() {
        },
        defaults: {
            areacode:0,
            name:'',
            level:''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });



})();

