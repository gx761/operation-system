/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var McompanyModel = Backbone.Model.extend({

        urlRoot: 'api/communities/mcompany',

        idAttribute:'communityId',

        initialize: function(options) {
      //      this.url = this.url+'/'+options.communityId;
        },

        defaults: {
            communityId:0,
            name:'',
            contact_mobile:'',
            contact_name:'',
          
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    return McompanyModel;
});
