/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/cityModel'
], function (_, Backbone, CityModel) {
    'use strict';

    var CityCollection = Backbone.Collection.extend({
        model: CityModel,
    });

    return CityCollection;
});
