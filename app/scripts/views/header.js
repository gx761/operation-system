/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'app'
], function($, _, Backbone, JST, app) {
    'use strict';

    var HeaderView = Backbone.View.extend({
        template: JST['app/scripts/templates/header.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            "click #logout-link" : "onLogoutClick",
            "click #remove-account-link" :"onRemoveAccountClick"
        },

        initialize: function() {
            app.session.on('change:logged_in',this.onLoginStatusChange)
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        },
        onLoginStatusChange: function(event) {
            this.render();
            if (app.session.get("logged_in")) app.showAlert("Success!", "Logged in as " + app.session.user.get("username"), "alert-success");
            else app.showAlert("See ya!", "Logged out successfully", "alert-success");

        },
        onLogoutClick :function(event){
            event.preventDefault();
            app.session.logout({});
        },
        onRemoveAccountClick:function(event){
            event.preventDefault();
            app.session.removeAccount({});
        },
        render:function(){
            if(DEBUG) console.log("RENDER::",app.session.user.toJSON(),app.session.toJSON());
            this.$el.html(this.template({
                logged_in:app.session.get("logged_in"),
                user:app.session.user.toJSON()
            }));
            return this;
        }
    });

    return HeaderView;
});