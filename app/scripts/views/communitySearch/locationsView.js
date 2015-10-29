/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communitySearch/locationView'
], function ($, _, Backbone, JST, LocationView) {

    'use strict';

    var LocationsView = Backbone.View.extend({

        events: {
            'change': 'changeSelected'
        },
        initialize: function (options) {
        //    this.el = options.el;
             _.bindAll(this);
            this.collection.on('reset', this.addAll);
        },
        addOne: function (location) {
            var locationView = new LocationView({model: location});
            this.locationViews.push(locationView);

            $(this.el).append(
                locationView.render().el
            );
        },
        addAll: function () {
            _.each(this.locationViews,function(locationView){
              locationView.remove();
            });
            this.locationViews = [];
            this.collection.each(this.addOne);
        },
        changeSelected: function () {
            if(this.$el.val()){
                this.setSelectedId(this.$el.val());
            }
            else{
                if(this.childrenView){
                   this.resetChildrenView(this.childrenView,0); 
                }
                
                if(this.parentView){
                    this.parentView.updateSearchResults();
                }
                
            }
        },

    

        populateForm:function(url){
            this.childrenView.collection.url=url;
            this.childrenView.collection.fetch({reset:true});
            this.resetChildrenView(this.childrenView,1);
        },
        resetChildrenView:function(childrenView,level){

                while(level&&level>0){
                    if(childrenView.childrenView){
                        childrenView = childrenView.childrenView;
                        level--;
                    }
                    else{
                        break;
                    }
                }

            childrenView.collection.reset();
            if(childrenView.childrenView){
               this.resetChildrenView(childrenView.childrenView);
            }
        }

    });

    return LocationsView;
});
