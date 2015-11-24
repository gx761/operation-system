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

        className: 'clearfix',

        events: {
            'click #add-community': 'showAddCommunity',
            'click #foldup': 'toggleSearchBar'

        },

        initialize: function() {

            _.bindAll(this);
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

        toggleSearchBar:function(e){
            e.preventDefault();

            var target = this.$el.find('#community-search');

            if(target.hasClass('searchBar-inactive')){
                target.removeClass('searchBar-inactive');
                e.target.textContent = '收起';

                $('#content').addClass('withSidebar');
            }
            else{
                target.addClass('searchBar-inactive'); 
                e.target.textContent = '展开';
                $('#content').removeClass('withSidebar');
            }

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
      //          el: '#country-selector',
                name:'country',
                collection: this.countryCollection
            });

            $('#country-selector').html(this.countriesView.render().el);


            this.provincesView = new ProvincesView({
            //    el: '#province-selector',
                name:'province',
                collection: this.provinceCollection
            });
            $('#province-selector').html(this.provincesView.render().el);


            this.citiesView = new CitiesView({
       //         el: '#city-selector',
                name:'city',
                collection: this.cityCollection
            });

                $('#city-selector').html(this.citiesView.render().el);

            this.districtsView = new DistrictsView({
        //       el: '#district-selector',
                name:'district',
                collection: this.districtCollection
            });

            $('#district-selector').html(this.districtsView.render().el);


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
                countryId: $('#country-selector select').val(),
                provinceId: $('#province-selector select').val(),
                cityId: $('#city-selector select').val(),
                districtId: $('#district-selector select').val(),
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
       //     this.populate();
            return this;
        }
    });

    return CommunitySearchView;
});