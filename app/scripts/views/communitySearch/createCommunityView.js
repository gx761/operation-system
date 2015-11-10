/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/communitySearch/countryCollection',
    'collections/communitySearch/cityCollection',
    'collections/communitySearch/provinceCollection',
    'collections/communitySearch/districtCollection',
    'views/communitySearch/locationsView',
    'BackboneValidation',
    'views/modalDialogView',

], function($, _, Backbone, JST, CountryCollection, CityCollection, ProvinceCollection, DistrictCollection, LocationsView) {
    'use strict';

    var CreateCommunityView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/communitySearch/createCommunity.ejs'],

        events: {
            'click #cancel_create': 'cancelCreate',
            'click #confirm_create': 'confirmCreate'
        },

        initialize: function() {
            //        this.listenTo(this.model, 'change', this.render);
           _.bind(this.hideModal,this);
        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));
            Backbone.Validation.bind(this);
            return this;
        },
        populate: function() {

            this.countryCollection = new CountryCollection({});
            this.cityCollection = new CityCollection({});
            this.provinceCollection = new ProvinceCollection({});
            this.districtCollection = new DistrictCollection({});

            var CountriesView = LocationsView.extend({
                setSelectedId: function(countryId) {
                    this.populateForm('api/ajax/' + countryId + '/getProvinces');
                }
            });

            var ProvincesView = LocationsView.extend({
                setSelectedId: function(provinceId) {
                    this.populateForm('api/ajax/' + provinceId + '/getCities');
                }
            });
            var CitiesView = LocationsView.extend({
                setSelectedId: function(cityId) {
                    this.populateForm('api/ajax/' + cityId + '/getDistricts');
                }
            });

            var DistrictsView = LocationsView.extend({
                setSelectedId: function() {}
            });


            this.countriesView = new CountriesView({
                el: '#new_country_selector',
                collection: this.countryCollection
            });
            this.provincesView = new ProvincesView({
                el: '#new_province_selector',
                collection: this.provinceCollection
            });
            this.citiesView = new CitiesView({
                el: '#new_city_selector',
                collection: this.cityCollection
            });

            this.districtsView = new DistrictsView({
                el: '#new_district_selector',
                collection: this.districtCollection
            });

            this.countriesView.childrenView = this.provincesView;
            this.provincesView.childrenView = this.citiesView;
            this.citiesView.childrenView = this.districtsView;

            this.countryCollection.fetch({
                reset: true,
            });

        },
        cancelCreate: function(e) {
            e.preventDefault();
            this.hideModal();
        },
        confirmCreate: function(e) {
            e.preventDefault();
            var instance = this.$el.find('#create_community_form');
            instance.parsley().validate();
            if (instance.parsley().isValid()) {
                this.model.set('communityname',$('#create_community_name').val());
                this.model.set('citycode',$('#new_city_selector').val());
                this.model.set('areacode',$('#new_district_selector').val());
                this.model.set('gpslng',$('#gpslng').val());
                this.model.set('gpslat',$('#gpslat').val());

                this.model.validate();
                var self=this;

                if(this.model.isValid()){
                    this.model.save(null,{
                        success:function(model, response, options){
                            self.showNotification('小区添加成功');
                            self.hideModal();
                        }
                    });
                }

                
                
            }
        }



    });


    return CreateCommunityView;
});