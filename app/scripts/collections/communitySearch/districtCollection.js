/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/districtModel'
], function (_, Backbone, DistrictModel) {
    'use strict';

    var DistrictCollection = Backbone.Collection.extend({
        model: DistrictModel
    });

    return DistrictCollection;
});
