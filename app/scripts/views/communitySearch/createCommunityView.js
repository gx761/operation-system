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
    'views/modalDialogView'
], function($, _, Backbone, JST, CountryCollection, CityCollection, ProvinceCollection, DistrictCollection,LocationsView) {
    'use strict';

    var CreateCommunityView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/communitySearch/createCommunity.ejs'],



        initialize: function() {
            //        this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        },
        populate: function() {

            this.countryCollection = new CountryCollection({});
            this.cityCollection = new CityCollection({});
            this.provinceCollection = new ProvinceCollection({});
            this.districtCollection = new DistrictCollection({});

            var CountriesView = LocationsView.extend({
                setSelectedId: function(countryId) {
                    this.populateForm('api/communities/' + countryId + '/getProvinces');
                }
            });

            var ProvincesView = LocationsView.extend({
                setSelectedId: function(provinceId) {
                    this.populateForm('api/communities/' + provinceId + '/getCities');
                }
            });
            var CitiesView = LocationsView.extend({
                setSelectedId: function(cityId) {
                    this.populateForm('api/communities/' + cityId + '/getDistricts');
                }
            });

             var DistrictsView = LocationsView.extend({
                setSelectedId: function() {
                }
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

        }



    });


    return CreateCommunityView;
});