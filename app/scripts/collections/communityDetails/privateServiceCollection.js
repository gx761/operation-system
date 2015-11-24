/*global define*/

define([
	'app',
    'underscore',
'backbone',
    'models/communityDetails/privateServiceModel'
], function (app,_, Backbone, PrivateServiceModel) {
    'use strict';

    var PrivateServiceCollection = Backbone.Collection.extend({
        model: PrivateServiceModel,

    });

    return PrivateServiceCollection;
});
