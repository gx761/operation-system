/*global define*/
OperationSystem.Views =OperationSystem.Views||{};

(function(){
    'use strict';
    OperationSystem.Views.IndexView = Backbone.View.extend({
        template: JST['app/scripts/templates/index.ejs'],

        tagName: 'div',

        id: 'indexView',

        className: '',

        events: {},

        initialize: function () {
          //  this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
        },

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
    });


} )();

