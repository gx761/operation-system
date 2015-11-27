/*global define*/
OperationSystem.Views =OperationSystem.Views||{};

(function(){
    'use strict';
    OperationSystem.Views.HeaderView = Backbone.View.extend({
        template: JST['app/scripts/templates/header.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click #logout-link' : 'onLogoutClick',
            'click #remove-account-link' :'onRemoveAccountClick'
        },

        initialize: function() {
            _.bindAll(this);
            OperationSystem.app.session.user.on('change:email',this.onLoginStatusChange)
        },

        onLoginStatusChange: function(event) {
            this.render();
            if (OperationSystem.app.session.get('logged_in')) OperationSystem.app.showAlert('Success!', 'Logged in as ' + OperationSystem.app.session.user.get('email'), 'alert-success');
            else OperationSystem.app.showAlert('See ya!', 'Logged out successfully', 'alert-success');

        },
        onLogoutClick :function(event){
            event.preventDefault();
            OperationSystem.app.session.logout({});
        },
        onRemoveAccountClick:function(event){
            event.preventDefault();
            OperationSystem.app.session.removeAccount({});
        },
        render:function(){
            // if(DEBUG) console.log('RENDER::',OperationSystem.app.session.user.toJSON(),OperationSystem.app.session.toJSON());
            this.$el.html(this.template({
                logged_in:OperationSystem.app.session.get('logged_in'),
                user:OperationSystem.app.session.user.toJSON()
            }));
            return this;
        }
    });


} )();


