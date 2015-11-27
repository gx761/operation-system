/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.communitySearch = OperationSystem.Views.communitySearch ||{};

(function(){
    'use strict';
    OperationSystem.Views.communitySearch.CommunityView = Backbone.View.extend({

        template: JST['app/scripts/templates/communitySearch/community.ejs'],

        el :'#community-name-input',

        events: {
            'change': 'changeSelected'
        },

        initialize: function () {
        //    this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
            this.render();
        },

        changeSelected:function(){
            this.setName();
        },

        render: function () {
            this.$el.html(this.template({}));
            return this;
        }
        
    });


})();
