/*global define*/

define([
    'app',
    'models/UserModel'
], function(app, UserModel) {
    'use strict';

    var SessionModel = Backbone.Model.extend({
        url: function() {
            return app.API + 'auth';
        },

        initialize: function() {
            this.user = new UserModel({});
        },

        defaults: {
            logged_in: false,
            user_id: ''
        },
        //use user data to update the session model data
        updateSessionUser: function(userData) {
            this.user.set(_pick(userData, _.keys(this.user.defaults)))
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
                    };
                })
                .complete(function() {
                    if ('complete' in callback)
                        callback.complete();
                });

        },

        postAuth: function(options, callback, args) {
            var self = this;
            var postData = _.omit(options, 'method');
            if (DEBUG) console.log(postData);

            $.ajax({
                url: this.url() + '/' + options.method,
                contentType: 'application/json',
                dataType: 'json',
                type: 'POST',
                beforeSend: function(xhr) {
                    var token = $('meta[name="csrf-token"]').attr('content');
                    if (token)
                        xhr.setRequestHeader('X-CSRF-Token', token);
                },
                success: function(res) {
                    if (!res.error) {
                        if (_indexOf(['login', 'signup'], options.method)) {
                            self.updateSessionUser(res.user || {});
                            self.set({
                                user_id: res.user.id,
                                logged_in: true
                            });
                        } else {
                            self.set({
                                logged_in: false
                            });
                        }

                        if (call && 'success' in callback) callback.success(res);
                    } else {
                        if (callback && 'error' in callback) callback.error(res);
                    }
                },
                error: function(mod, res) {
                    if (callback && 'error' in callback) callback.error(res);
                }
            }).complete(function() {
                if (callback && 'complete' in callback) callback.complete();
            });

        },
        login: function(options, callback, args) {
            this.postAuth(_.extend(options, {
                method: 'login'
            }, callback));
        },
        logout: function(options, callback, args) {
            this.postAuth(_.extend(options, {
                method: 'logout'
            }, callback));
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