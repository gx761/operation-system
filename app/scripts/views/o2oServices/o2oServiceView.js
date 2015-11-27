/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.o2oServices = OperationSystem.Views.o2oServices ||{};

(function(){
    'use strict';
    OperationSystem.Views.o2oServices.O2oServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/o2oServices/o2oService.ejs'],

        tagName: 'div',

        id: '',

        className: 'service_box ',

        events: {
            'click .stop_service': 'disbaleO2oService',
            'click .start_service': 'startO2oService',
            'click .close': 'deleteO2oService',
            'click .service_title':'showO2oServiceDetails'
        },
        disbaleO2oService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要暂停该服务?');
            if (returnValue === true) {
                this.model.urlRoot = 'api/services/toggleO2oService';
                this.model.save({
                    status: 'inactive'
                }, {
                    wait: true,
                    success: function(model, response, options) {},
                    error: function(model, response, options) {
                        window.alert('无法暂停该服务, 有' + response.responseJSON.numberOfCommunities + '个小区正在使用该服务');
                    },
                    parse: false
                });
            } else {
                return;
            }
        },
        startO2oService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要启动该服务?');
            if (returnValue === true) {
                this.model.urlRoot = 'api/services/toggleO2oService';
                this.model.save({
                    status: 'active'
                }, {
                    wait: true,
                    parse: false
                });
            } else {
                return;
            }
        },
        deleteO2oService: function(e) {
            e.preventDefault();

            if (this.model.get('status') === 'active') {
                window.alert('在删除服务之前请先暂停该服务');
                return;
            }

            var returnValue = window.confirm('请确认是否要删除该服务?');
            if (returnValue === true) {
                this.model.urlRoot = 'api/services/o2oServices';
                this.model.destroy({
                    wait: true,
                    success: function(model, response, options) {

                    },
                    error: function(model, response, options) {
                        window.alert('无法删除该服务, 有' + response.responseJSON.numberOfCommunities + '个小区正在使用该服务');
                    }

                });
            } else {
                return;
            }
        },
        showO2oServiceDetails: function(e) {

            e.preventDefault();

            var view = new OperationSystem.Views.o2oServices.O2oServiceDetailsView({
                model:  this.model,
                communityId:this.communityId
            });
            view.render();
           

        },

        initialize: function() {

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },


        render: function() {

            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }
    });

})();
