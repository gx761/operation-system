/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/provinceModel'
], function (_, Backbone, ProvinceModel) {
    'use strict';

    var ProvinceCollection = Backbone.Collection.extend({
        model: ProvinceModel
    });

    return ProvinceCollection;
});
