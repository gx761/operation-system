/*global define*/

define([
    'app',
    'models/UserModel',
    'js-cookie'
], function(app, UserModel,Cookies) {
    'use strict';

    var SessionModel = Backbone.Model.extend({
        url: function() {
            return app.API + 'auth/local';
        },

        initialize: function() {
            this.user = new UserModel({});
        },

        defaults: {
            logged_in: false,
            token: ''
        },
        //use user data to update the session model data
        updateSessionUser: function(token) {
            this.user.fetch({
                success:function(model,res){
                    console.log(model);
                }
            });

/*
            this.user.set(_.pick(token, _.keys(this.user.defaults)))
*/
        },
        setTokenInHeader:function(token){
            Backbone.$.ajaxSetup({
                headers: { 'Authorization': 'Bearer '+token }
            });
        },

        //check the session and call the callback

        checkAuth: function(callback, args) {
            var self = this;
            this.fetch({
                    success: function(mod, res) {
                        if (!res.error && res.user) {
                            self.updateSessionUser(res.user);
                            self.set({
                                logged_in: true
                            });
                            if ('success' in callback)
                                callback.success(mod, res);
                        } else {
                            self.set({
                                logged_in: false
                            });
                            if ('error' in callback)
                                callback(mod, res);
                        }
                    },
                    error: function(mod, res) {
                        self.set({
                            logged_in: false
                        });
                        if ('error' in callback)
                            callback.error(mod, res);
                    }
                })
                .complete(function() {
                    if ('complete' in callback)
                        callback.complete();
                });

        },

        postAuth: function(options, callback, args) {
            var self = this;
            var postData = _.omit(options, 'method');
            console.log(options);
            console.log(arguments);
            $.ajax({
                url: this.url() + '/' + options.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                data: JSON.stringify(postData),
                beforeSend: function(xhr) {
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if (token)
                        xhr.setRequestHeader('X-CSRF-Token', token);
                },
                success: function(res) {
                    if (!res.error) {
                        if (_.indexOf(['login', 'signup'], options.method)!==-1) {
                            console.log("arrived at here0");
                            self.set({
                                token: res.token,
                                logged_in: true
                            });
                            self.setTokenInHeader(res.token || {});
                            self.updateSessionUser(res.token || {});
                        } else {
                            self.set({
                                logged_in: false
                            });
                        }
                        if (callback && 'success' in callback) callback.success(res);
                    } else {
                        if (callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(res) {
                    if (callback && 'error' in callback) callback.error(res);
                }
            }).complete(function() {
                if (callback && 'complete' in callback) callback.complete();
            });

        },
        login: function(options, callback, args) {

            this.postAuth(_.extend(options, {
                method: 'login'
            }), callback);
        },
        logout: function(options, callback, args) {
            this.postAuth(_.extend(options, {
                method: 'logout'
            }), callback);
        },
        signup: function(options, callback, args) {
            this.postAuth(_.extend(options, {
                method: 'signup'
            }), callback);
        },
        removeAccount: function(options, callback, args) {
            this.postAuth(_extend(options, {
                method: 'remove_account'
            }), callback);
        }


    });

    return SessionModel;
});