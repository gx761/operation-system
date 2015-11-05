/*global define*/

define([
    'underscore',
    'backbone',
    'models/communityDetails/publicServiceModel'
], function (_, Backbone, PublicServiceModel) {
    'use strict';

    var PublicServiceCollection = Backbone.Collection.extend({
        model: PublicServiceModel
    });

    return PublicServiceCollection;
});
