/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.o2oServices = OperationSystem.Views.o2oServices ||{};

(function(){
    'use strict';
    OperationSystem.Views.o2oServices.O2oServiceDetailsView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/o2oServices/o2oServiceDetails.ejs'],


        events: {
            'click .expand_panel:not(.active)': 'togglePanel'
        },

        initialize: function(options) {
            this.communityId = options.communityId;
            _.bindAll(this);

        },

        togglePanel: function(e) {
            var clickElement = e.currentTarget;
            var contents= $('.tab-contents');

            clickElement = $(clickElement);

            clickElement.parent().children('.expand_panel.active').removeClass('active');

            clickElement.addClass('active');

            if(clickElement.hasClass('showEditService')){
                contents.css({top:'-452px'});
            }
            else{
                contents.css({top:'0px'});
            }   

        },
        populateCommunities: function() {

            var communityCollection = new OperationSystem.Collections.communitySearch.CommunityCollection({});
            communityCollection.url = 'api/services/o2oServices/' + this.model.id + '/communities';
            var listCommunitiesView = new OperationSystem.Views.o2oServices.ListCommunitiesView({
                el: '#service_communities',
                collection: communityCollection
            });
            communityCollection.fetch({
                reset: true
            });

        },
        populateService: function() {

            var editO2oServiceView = new OperationSystem.Views.o2oServices.EditO2oServiceView({
                el:'#edit_service',
                model:this.model,
            });

            editO2oServiceView.parentView = this;

            editO2oServiceView.render();

        },
        render: function() {

            this.$el.html(this.template(this.model.toJSON()));
           this.showModal();

            this.populateCommunities();
            this.populateService();


            return this;
        }
    });
})();

