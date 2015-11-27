/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.o2oServices = OperationSystem.Views.o2oServices ||{};

(function(){
    'use strict';
    OperationSystem.Views.o2oServices.ListCommunitiesView = Backbone.View.extend({
        template: JST['app/scripts/templates/listCommunities.ejs'],

        // tagName: 'div',

        // id: '',

        // className: '',

        events: {},

        initialize: function() {

            this.listenTo(this.collection, 'reset', this.render);
        },

        render: function() {

            var columns = [ {
                name: 'communityname',
                label: '小区名称',
                cell: 'string' ,
                editable: false
            }, 
            {
                name: 'provincename',
                label: '省份',
                cell: 'string' ,
                editable: false
            }, 
            {
                name: 'cityname',
                label: '城市',
                cell: 'string' ,
                editable: false
            }, 
            {
                name: 'districtname',
                label: '区域',
                cell: 'string' ,
                editable: false
            }];


            var grid = new Backgrid.Grid({
                columns: columns,
                collection: this.collection
            });

            var table = grid.render().el;
            $(table).addClass('table table-bordered');




            // Render the grid and attach the root to your HTML document
            this.$el.html(table);

            //     this.$el.html(this.template(this.model.toJSON()));
        }
    });

})();

