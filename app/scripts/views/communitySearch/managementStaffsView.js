/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communitySearch = OperationSystem.Views.communitySearch ||{};

(function(){
    'use strict';
    OperationSystem.Views.communitySearch.ManagementStaffsView = Backbone.View.extend({

        tagName:'select',
        className:'form-control',

        events: {
        },
        initialize: function (options) {
            this.$el.attr('name',options.name) ;
            $(this.el).html('<option value="">请选择</option>');
            _.bindAll(this);
            this.collection.on('reset', this.addAll);
        },
        addOne: function (location) {
            var managementStaffView = new OperationSystem.Views.communitySearch.ManagementStaffView({model: location});
            this.managementStaffViews.push(managementStaffView);

            $(this.el).append(
                managementStaffView.render().el
            );
        },
        addAll: function () {
            _.each(this.managementStaffViews,function(managementStaffView){
                managementStaffView.remove();
            });
            this.managementStaffViews = [];
            this.collection.each(this.addOne);
        }


    });
})();

