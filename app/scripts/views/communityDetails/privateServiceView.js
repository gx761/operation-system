/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var PrivateServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/communityDetails/privateService.ejs'],

        tagName: 'div',

        id: '',

        className: 'service_box  col-sm-6 col-md-3',

        events: {
            'click .stop_service':'disbalePrivateService',
            'click .start_service':'startPrivateService',
            'click .close':'deletePrivateService',
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
             this.listenTo(this.model, 'destroy', this.remove);

        },
        disbalePrivateService:function(e){
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要暂停该服务?');
            if(returnValue===true){
                this.model.set('status','inactive');
                this.model.save({},{parse:false});
            }
            else{
                return;
            }
        },
        startPrivateService:function(e){
            e.preventDefault();
            var returnValue = window.confirm('请确认是否要启动该服务?');
            if(returnValue===true){
                this.model.set('status','active');
                this.model.save({},{parse:false});
            }
            else{
                return;
            }

        },
        deletePrivateService:function(e){
            e.preventDefault();
             var returnValue = window.confirm('请确认是否要删除该服务?');
            if(returnValue===true){
               // this.model.set('status','active');
                this.model.destroy();
            }
            else{
                return;
            }

        },


        render: function () {


            this.$el.html(this.template(this.model.toJSON()));
            
            return this;
        }
    });

    return PrivateServiceView;
});
