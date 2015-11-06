/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'BackboneValidation',
    'views/modalDialogView',
    'jquery.iframe-transport'

], function($, _, Backbone, JST) {
    'use strict';

    var CreatePrivateServiceView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/communityDetails/createPrivateServiceView.ejs'],

        events: {
            'click #cancel_create': 'cancelCreate',
            'click #confirm_create': 'confirmCreate',
            'click #add-logo-button': 'uploadLogo',
            'change #logo_file': 'previewLogo'

        },

        initialize: function() {
            //        this.listenTo(this.model, 'change', this.render);
            _.bind(this.hideModal, this);
        },

        render: function() {

            this.$el.html(this.template(this.model.toJSON()));
            Backbone.Validation.bind(this);
            return this;
        },
        previewLogo: function() {

            var prevDiv = $('.logo-box-image');
            var file = $('#logo_file')[0];

            if (file.files[0].type !== 'image/jpeg' && file.files[0].type !== 'image/png') {
                file.files = [];


                if (file.outerHTML) {
                    file.outerHTML = file.outerHTML;
                } else { // FF(包括3.5)
                    file.value = '';
                }
                return false;
            }

            if (file.files && file.files[0]) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    prevDiv.html('<img src="' + evt.target.result + '" />');
                };
                reader.readAsDataURL(file.files[0]);
            } else {
                prevDiv.html('<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>');
            }


        },
        uploadLogo: function(e) {
            e.preventDefault();
            $('#logo_file').focus().click();

        },

        cancelCreate: function(e) {
            e.preventDefault();
            this.hideModal();
        },
        confirmCreate: function(e) {
            e.preventDefault();
            var instance = this.$el.find('#create_private_service_form');
            instance.parsley().validate();



            if (instance.parsley().isValid()) {


                // this.model.set('communityname', $('#create_community_name').val());
                // this.model.set('citycode', $('#new_city_selector').val());
                // this.model.set('areacode', $('#new_district_selector').val());
                // this.model.set('gpslng', $('#gpslng').val());
                // this.model.set('gpslat', $('#gpslat').val());
                // this.model.validate();

                var values={};
                

                _.each($('#create_private_service_form').serializeArray(),function(input){
       
                    values[input.name] = input.value;

                });


                var self = this;

                this.model.save(values, {
                    iframe:true,
                    data:values,
                    files:$('#logo_file'),
                    success: function(model, response, options) {
                        alert('物业自营服务添加成功');
                        self.hideModal();
                    },
                    error:function(model, response, options){
                        console.log(response);
                    }
                });


            }
        }



    });


    return CreatePrivateServiceView;
});