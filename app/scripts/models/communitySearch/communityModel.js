/*global define*/

define([
    'underscore',
    'backbone',
   
], function(_, Backbone) {
    'use strict';

    var CommunityModel = Backbone.Model.extend({
        url: '/api/communities',

        initialize: function() {},

        idAttribute: 'communitycode',
        defaults: {
            communitycode: null,
            communityname: '',
            description: '',
            citycode: '',
            areacode: '',
            type: '',
            gpslat: '',
            gpslng: ''
        },

        validation: {
           
            communityname: {
                required: true
            },
            description: {
                required: false,
                length: 300
            },
            citycode: {
                range: [0, 532926]
            },
            areacode: {
                range: [0, 532926]
            },
            type:{
                required:false
            },
            gpslat:{
                required: false
            },
            gpslng:{
                required: false
            },
            // someAttribute: function(value) {
            //     if (value !== 'somevalue') {
            //         return 'Error message';
            //     }
            // }
        },

        parse: function(response, options) {
            return response;
        }
    });

    return CommunityModel;
});