/*global define*/

define([
    'underscore',
    'backbone',
    'models/communitySearch/communityModel',
    'app'
], function (_, Backbone, CommunityModel,app) {
    'use strict';

    var CommunityCollection = Backbone.Collection.extend({
        model: CommunityModel,
        url: app.API + 'api/communities/getCommunities'
    });

    return CommunityCollection;
});
