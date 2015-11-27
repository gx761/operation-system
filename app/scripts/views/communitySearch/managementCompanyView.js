/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communitySearch = OperationSystem.Views.communitySearch ||{};

(function(){
    'use strict';
    OperationSystem.Views.communitySearch.ManagementCompanyView = Backbone.View.extend({
        tagName: 'option',

        className: '',

        events: {},

        initialize: function () {
            _.bindAll(this);
        },

        render: function () {
            //   console.log(this.model.get("areacode"));

            $(this.el).attr('value',this.model.get('id')).html(this.model.get('name'));
            //           console.log(this.el);

            return this;
        }
    });


})();
