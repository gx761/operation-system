/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'views/communitySearch/managementCompanyView'
], function ($, _, Backbone, JST,ManagementCompanyView) {
    'use strict';

    var ManagementCompaniesView = Backbone.View.extend({
        tagName:'select',
        className:'form-control',

        events: {
            'change': 'changeSelected'
        },
        initialize: function (options) {
            this.$el.attr('name',options.name) ;
            $(this.el).html('<option value="">请选择</option>');
            _.bindAll(this);
            this.collection.on('reset', this.addAll);
        },
        addOne: function (location) {
            var managementCompanyView = new ManagementCompanyView({model: location});
            this.managementCompanyViews.push(managementCompanyView);

            $(this.el).append(
                managementCompanyView.render().el
            );
        },
        addAll: function () {
            _.each(this.locationViews,function(managementCompanyView){
                managementCompanyView.remove();
            });
            this.managementCompanyViews = [];
            this.collection.each(this.addOne);
        },
        changeSelected: function () {

            if(this.$el.val()){
                this.setSelectedId(this.$el.val());
            }
            else{
                if(this.childrenView){
                    this.resetChildrenView(this.childrenView,0);
                }

            }
        },
        setSelectedId: function(company_id) {
            this.populateForm('api/ajax/' + company_id + '/getManagementStaff');
        },


        populateForm:function(url){
            this.childrenView.collection.url=url;
            this.childrenView.collection.fetch({reset:true});
            this.resetChildrenView(this.childrenView,1);
        },
        resetChildrenView:function(childrenView,level){

            while(level&&level>0){
                if(childrenView.childrenView){
                    childrenView = childrenView.childrenView;
                    level--;
                }
                else{
                    break;
                }
            }

            childrenView.collection.reset();
            console.log(123);
            if(childrenView.childrenView){
                this.resetChildrenView(childrenView.childrenView);
            }
        }
    });

    return ManagementCompaniesView;
});
