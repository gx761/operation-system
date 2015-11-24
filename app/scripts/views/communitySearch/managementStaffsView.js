/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communitySearch/managementStaffView'
], function ($, _, Backbone, JST,ManagementStaffView) {
    'use strict';

    var ManagementStaffsView = Backbone.View.extend({

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
            var managementStaffView = new ManagementStaffView({model: location});
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

    return ManagementStaffsView;
});
