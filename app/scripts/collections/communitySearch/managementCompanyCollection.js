/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/managementCompanyModel',
    'app'
], function (_, Backbone, ManagementCompanyModel,app) {
    'use strict';

    var ManagementCompanyCollection = Backbone.Collection.extend({
        model: ManagementCompanyModel,
        url: app.API + 'api/ajax/companies',
    });

    return ManagementCompanyCollection;
});
