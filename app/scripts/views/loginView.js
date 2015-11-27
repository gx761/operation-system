/*global define*/
OperationSystem.Views =OperationSystem.Views||{};

(function(){
    'use strict';
    OperationSystem.Views.LoginView = Backbone.View.extend({
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
                OperationSystem.app.session.login({
                    email: this.$("#login-email-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                    success: function (res) {
                       console.log("SUCCESS",res);

                       OperationSystem.app.router.navigate("/", {trigger: true,replace: true});


                    },
                    error: function (err) {
                        console.log("ERROR", err);
                        OperationSystem.app.showAlert('Bummer dude!', err.responseJSON.message, 'alert-danger');
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                console.log("Did not pass clientside validation");
            }
        },


        initialize: function () {
            _.bindAll(this);
            OperationSystem.app.session.on("change:logged_in", this.render);
        },

        render: function () {
      //      if(OperationSystem.app.session.get('logged_in')) this.template = JST['OperationSystem.app/scripts/templates/login.ejs'];
            this.$el.html(this.template({
                user: OperationSystem.app.session.user.toJSON()
            }));
            return this;

        }
    });


} )();
