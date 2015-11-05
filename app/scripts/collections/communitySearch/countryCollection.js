/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/countryModel',
    'app'
], function (_, Backbone, CountryModel,app) {
    'use strict';

    var CountryCollection = Backbone.Collection.extend({
        model: CountryModel,
        url: app.API + 'api/ajax/countries',
    });

    return CountryCollection;
});
