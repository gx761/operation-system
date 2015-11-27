/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communityDetails = OperationSystem.Views.communityDetails ||{};

(function(){
    'use strict';
    OperationSystem.Views.communityDetails.PublicServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/publicService.ejs'],

        tagName: 'div',

        id: '',

        className: 'service_box',

        events: {
            'click .stop_service': 'disablePublicService',
            'click .start_service': 'startPublicService',
        },
        disablePublicService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要暂停该服务?');
            if (returnValue === true) {
                this.model.set('status','inactive');
                this.model.save({}, {
                    parse: false,
                    wait:true
                });
            } else {
                return;
            }

        },
        startPublicService: function(e) {
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要启动该服务?');

            if (returnValue === true) {
                 this.model.set('status','active');
                this.model.set('community_id', parseInt(this.communityId));
                this.model.save({}, {
                    parse: true
                });
            } else {
                return;
            }
        },

        initialize: function(options) {
            _.bindAll(this);

            this.communityId = options.communityId;

            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });



})();
