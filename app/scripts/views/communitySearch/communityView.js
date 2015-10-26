/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var CommunityView = Backbone.View.extend({
        template: JST['app/scripts/templates/communitySearch/community.ejs'],

        el :"#community-name-input",


        events: {
            "change": "changeSelected"
        },

        initialize: function () {
        //    this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
            this.render();
        },
        changeSelected:function(){
            this.setName();
        },
        render: function () {

            this.$el.html(this.template({}));
            return this;
        }
    });

    return CommunityView;
});
