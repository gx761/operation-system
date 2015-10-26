/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var SearchResultView = Backbone.View.extend({

        tagName: 'li',

        id: '',

        className: '',

        events: {},

        initialize: function () {
          //  this.listenTo(this.model, 'change', this.render);

        },

        render: function () {
            $(this.el).attr('rel',this.model.get('communitycode')).html(this.model.get('communityname'));
            return this;
        }

    });

    return SearchResultView;
});
