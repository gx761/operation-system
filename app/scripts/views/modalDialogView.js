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
            var self =this;

            setTimeout(function(){
                  self.$el.addClass('in');
            self.backdrop.addClass('in');

            }, 150);

            $(document.body).on('keyup',this.keyUp.bind(this));
            return this;
        },
        hideModal: function() {
            var self=this;

            this.$el.removeClass('in');
            this.backdrop.removeClass('in');
            setTimeout(function(){
                self.$el.remove();
                self.backdrop.remove();
            }, 150);

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
        },
        showNotification:function(message){
            var notification=$('<div class="full-wrapper"><div class="alert alert-success float-alert">'+message+'</div></div>');
            notification.appendTo($('body'));
         
            // setTimeout(function(){
            //     notification.fadeOut('fast', function() {
            //         notification.remove();
            //     });
            // }, 3000);

        }

    });

    return this;
});