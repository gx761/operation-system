/*global define*/

define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'parsley'
    ], function (app, $, _, Backbone, JST) {
    'use strict';
    var LoginView = Backbone.View.extend({
        template: JST['app/scripts/templates/login.ejs'],

        tagName: 'div',

        id: 'loginView',

        className: '',

        events: {
            'click #login-btn': 'onLoginAttempt',
            'keyup #login-password-input': 'onPasswordKeyup'
        },

        onPasswordKeyup: function (evt) {
            var k = evt.keyCode || evt.which;
            if (k === 13 && $('#login-password-input').val() === '') {
                evt.preventDefault();
            }
            else if (k === 13) {
                evt.preventDefault();
                this.onLoginAttempt();
                return false;
            }
        },
        onLoginAttempt: function (evt) {
            if (evt) evt.preventDefault();

            if (this.$("#login-form").parsley().validate()) {
                app.session.login({
                    email: this.$("#login-email-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                    success: function (res) {
                       console.log("SUCCESS",res);

                       app.router.navigate("/", {trigger: true});


                    },
                    error: function (err) {
                        console.log("ERROR", err);
                        app.showAlert('Bummer dude!', err.responseJSON.message, 'alert-danger');
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                console.log("Did not pass clientside validation");
            }
        },


        initialize: function () {
            _.bindAll(this);
            app.session.on("change:logged_in", this.render);
        },

        render: function () {
      //      if(app.session.get('logged_in')) this.template = JST['app/scripts/templates/login.ejs'];
            this.$el.html(this.template({
                user: app.session.user.toJSON()
            }));
            return this;

        }
    });

    return LoginView;
});