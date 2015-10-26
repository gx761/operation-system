/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communitySearch/searchResultView'

], function ($, _, Backbone, JST,SearchResultView) {
    'use strict';

    var SearchResultsView = Backbone.View.extend({


        initialize: function () {
            _.bindAll(this);
            this.collection.on("reset", this.addAll);

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },
        addOne: function (community) {
            var searchResultView = new SearchResultView({model: community});
            this.searchResultsView.push(searchResultView);

            $(this.el).append(
                searchResultView.render().el
            );
        },
        addAll: function () {
            _.each(this.searchResultsView,function(searchResultView){
                searchResultView.remove();
            });
            this.searchResultsView = [];
            this.collection.each(this.addOne);
        }
    });

    return SearchResultsView;
});
