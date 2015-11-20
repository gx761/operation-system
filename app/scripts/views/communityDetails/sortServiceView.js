/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function($, _, Backbone, JST) {
    'use strict';

    var SortServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/sortService.ejs'],

        tagName: 'li',

        attributes: {
            'draggable': true
        },
        events: {
            'dragstart': 'start',
            'dragenter': 'enter',
            'dragleave': 'leave',
            'dragend': 'leave',
            'dragover': 'over',
            'drop': 'drop'
        },

        className: 'sortable-item',

        initialize: function(options) {
            this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
            _.extend(this, options);

            this.el.id = this.model.id;
            this.el.setAttribute('data-order', this.model.get('order'));

        },
        start: function(e) {
            this.parent.draggedModel = this.model;
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.dropEffect = 'move';
            e.dataTransfer.setData('id', e.target.id);

        },

        enter: function(e) {
            e.preventDefault();
            if (e.currentTarget !== e.target) {
                return false;
            }

            this.$el.addClass(this.overClass);
        },

        leave: function(e) {

            if (e.currentTarget !== e.target) {
                return false;
            }

            this.$el.removeClass(this.overClass);
        },

        over: function(e) {
            e.preventDefault();

            return false;
        },

        drop: function(e) {

            e.preventDefault();
            this.leave(e);
            var collection = this.model.collection,
                parent = this.parent,
                currentIndex = this.$el.index();
            var id = e.originalEvent.dataTransfer.getData('id');


            e.currentTarget.parentNode.insertBefore(document.getElementById(id), e.currentTarget);

            var originalOrder = this.model.get('order');
     //       this.model.set('order', currentIndex + 1);
            this.parent.draggedModel.set('order', currentIndex);
            var self = this;

            this.parent.collection.each(function(element, index, list) {
                if (element.get('order') < originalOrder) {
                    if (element !== self.parent.draggedModel) {
                        element.set('order', index);
                    }

                } else if (element.get('order') >= originalOrder) {
                    if (element !== self.parent.draggedModel) {
                        element.set('order', index + 1);
                    }
                }

            });
            this.parent.collection.sort();
            this.parent.syncToService();



            //     e.currentTarget.parentNode.appendChild();

            // collection.remove(parent.draggedModel);
            // collection.add(parent.draggedModel, {
            //     at: currentIndex
            // });

            // this.trigger('drop', this.parent.draggedModel);
        },


        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return SortServiceView;
});