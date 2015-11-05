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
    'collections/communitySearch/communityCollection',
    'views/communitySearch/locationsView',
    'views/communitySearch/searchResultsView',
    'views/communitySearch/communityView',
    'views/communitySearch/createCommunityView',
    'models/communitySearch/communityModel',

], function($, _, Backbone, JST, CountryCollection,
    CityCollection, ProvinceCollection, DistrictCollection, CommunityCollection,
    LocationsView, SearchResultsView, CommunityView, CreateCommunityView,CommunityModel) {
    'use strict';

    var CommunitySearchView = Backbone.View.extend({
        template: JST['app/scripts/templates/communitySearch/communitySearch.ejs'],

        tagName: 'div',

        id: '',

        className: '',

        events: {
            'click #add-community': 'showAddCommunity'

        },

        initialize: function() {
            //this.populateCountries();
            // this.listenTo(this.model, 'change', this.render);

        },
        showAddCommunity:function(e){
            e.preventDefault();
            var createCommunityModel = new CommunityModel({});
            var view = new CreateCommunityView({
                model:createCommunityModel
            });
            view.render().showModal().populate();


        },

        populate: function() {
            var self = this;
            this.countryCollection = new CountryCollection({});
            this.cityCollection = new CityCollection({});
            this.provinceCollection = new ProvinceCollection({});
            this.districtCollection = new DistrictCollection({});
            this.communityCollection = new CommunityCollection({});
            var CountriesView = LocationsView.extend({
                setSelectedId: function(countryId) {
                    this.populateForm('api/ajax/' + countryId + '/getProvinces');
                    self.updateSearchResults();
                }
            });

            var ProvincesView = LocationsView.extend({
                setSelectedId: function(provinceId) {
                    this.populateForm('api/ajax/' + provinceId + '/getCities');
                    self.updateSearchResults();
                }
            });

            var CitiesView = LocationsView.extend({
                setSelectedId: function(cityId) {
                    this.populateForm('api/ajax/' + cityId + '/getDistricts');
                    self.updateSearchResults();
                }
            });
            var DistrictsView = LocationsView.extend({
                setSelectedId: function() {
                    self.updateSearchResults();
                }
            });
            CommunityView = CommunityView.extend({
                setName: function() {
                    self.updateSearchResults();
                }
            });



            this.searchResultsView = new SearchResultsView({
                el: '#search-result-list',
                collection: this.communityCollection
            });
            this.communityView = new CommunityView({});
            this.countriesView = new CountriesView({
                el: '#country-selector',
                collection: this.countryCollection
            });
            this.provincesView = new ProvincesView({
                el: '#province-selector',
                collection: this.provinceCollection
            });
            this.citiesView = new CitiesView({
                el: '#city-selector',
                collection: this.cityCollection
            });
            this.districtsView = new DistrictsView({
                el: '#district-selector',
                collection: this.districtCollection
            });


            this.countriesView.childrenView = this.provincesView;
            this.provincesView.parentView = this;
            this.provincesView.childrenView = this.citiesView;
            this.citiesView.parentView = this;
            this.citiesView.childrenView = this.districtsView;
            this.districtsView.parentView = this;
            this.countryCollection.fetch({
                reset: true,
            });
        },
        updateSearchResults: function() {
            var postData = {
                countryId: $('#country-selector').val(),
                provinceId: $('#province-selector').val(),
                cityId: $('#city-selector').val(),
                districtId: $('#district-selector').val(),
                name: $('#community-name').val()
            };

            this.searchResultsView.collection.fetch({
                data: postData,
                reset: true,
                type: 'GET'
            });
        },


        render: function() {
            this.$el.html(this.template({}));
            this.populate();
            return this;
        }
    });

    return CommunitySearchView;
});