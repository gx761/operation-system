/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/managementStaffModel'
], function (_, Backbone, ManagementStaffModel) {
    'use strict';

    var ManagementStaffCollection = Backbone.Collection.extend({
        model: ManagementStaffModel
    });

    return ManagementStaffCollection;
});
