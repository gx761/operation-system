/*global define*/

define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function(app, $, _, Backbone, JST) {
    'use strict';

    var LoginView = Backbone.View.extend({
        template: JST['app/scripts/templates/login.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function() {
            app.session.on("change:logged_in", this.render);
        },

        render: function() {

            this.$el.html(this.template({
                user: app.session.user.toJSON()
            }));
            return this;

        }
    });

    return LoginView;
});