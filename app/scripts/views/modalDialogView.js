/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function($, _, Backbone, JST) {
    'use strict';

    Backbone.ModalView = Backbone.View.extend({
        template: JST['app/scripts/templates/modalDialog.ejs'],

        tagName: 'div',

        id: 'modal',

        className: 'modal fade ',

        events: {
            'click': 'clickOnScreen'
        },

        initialize: function() {
            //   this.listenTo(this.model, 'change', this.render);
            //   
            _.bindAll(this);
        },

        render: function() {
            //  this.$el.html(this.template(this.model.toJSON()));
        },
        showModal: function() {

            this.backdrop = $('<div class="modal-backdrop fade"></div>');
            $('body').append(this.$el);

            $('body').append(this.backdrop);

            this.$el.show();

            setTimeout(function(){
                  this.$el.addClass('in');
            this.backdrop.addClass('in');

            }.bind(this), 150);

            $(document.body).on('keyup',this.keyUp.bind(this));
            return this;


        },
        hideModal: function() {

            this.$el.removeClass('in');
            this.backdrop.removeClass('in');
            setTimeout(function(){
                this.$el.remove();
                this.backdrop.remove();
            }.bind(this), 150);

            $(document.body).off('keyup',this.keyUp.bind(this));
            this.$el.off('click');


        },
        keyUp: function(e) {
            if(e.keyCode===27){
                this.hideModal();
            }

        },
        clickOnScreen: function(e) {
            if (e.target.id === 'modal') {
                this.hideModal();
            }
        }

    });

    return this;
});