/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communityDetails/editPrivateServiceView'
], function($, _, Backbone, JST, EditPrivateServiceView) {
    'use strict';

    var PrivateServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/privateService.ejs'],

        tagName: 'div',

        id: '',

        className: 'service_box',

        events: {
            'click .stop_service': 'disbalePrivateService',
            'click .start_service': 'startPrivateService',
            'click .close': 'deletePrivateService',
            'click .service_title': 'editPrivateServiceDetails'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

        },
        editPrivateServiceDetails: function(e) {
            e.preventDefault();
            var editPrivateServiceView = new EditPrivateServiceView({
                model: this.model
            });
            editPrivateServiceView.render().showModal();


        },
        disbalePrivateService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要暂停该服务?');
            if (returnValue === true) {
                this.model.urlRoot = 'api/services/togglePrivateService';
                this.model.set('status', 'inactive');
                this.model.save({}, {
                    parse: true
                });
            } else {
                return;
            }
        },
        startPrivateService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要启动该服务?');
            if (returnValue === true) {
                this.model.urlRoot = 'api/services/togglePrivateService';
                this.model.set('status', 'active');
                this.model.save({}, {
                    parse: true
                });
            } else {
                return;
            }

        },
        deletePrivateService: function(e) {
            e.preventDefault();

            if (this.model.get('status') === 'active') {
                window.alert('在删除服务之前请先暂停该服务');
                return;
            }

            var returnValue = window.confirm('请确认是否要删除该服务?');
            if (returnValue === true) {
                // this.model.set('status','active');
                this.model.urlRoot = 'api/services/privateServices';
                this.model.destroy({
                    wait: true
                });
            } else {
                return;
            }

        },


        render: function() {


            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

    return PrivateServiceView;
});