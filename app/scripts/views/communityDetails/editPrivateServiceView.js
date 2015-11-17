/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function($, _, Backbone, JST) {
    'use strict';

    var EditPrivateServiceView = Backbone.ModalView.extend({
        template: JST['app/scripts/templates/communityDetails/editPrivateService.ejs'],

        events: {
            'click #cancel_edit': 'cancelEdit',
            'click #confirm_edit': 'confirmEdit',
            'click #add-logo-button': 'uploadLogo',
            'change #logo_file': 'previewLogo'
        },

        initialize: function() {
            _.bindAll(this);
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            console.log(this.model);
            this.$el.html(this.template(this.model.toJSON()));
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
        cancelEdit: function(e) {
            e.preventDefault();
            this.hideModal();
        },
        confirmEdit: function(e) {
            e.preventDefault();
            var instance = this.$el.find('#edit_private_service_form');
            instance.parsley().validate();

            if (instance.parsley().isValid()) {

                // this.model.set('communityname', $('#create_community_name').val());
                // this.model.set('citycode', $('#new_city_selector').val());
                // this.model.set('areacode', $('#new_district_selector').val());
                // this.model.set('gpslng', $('#gpslng').val());
                // this.model.set('gpslat', $('#gpslat').val());
                // this.model.validate();

                //  var values = {};

                var formData = new FormData($('#edit_private_service_form')[0]);

                // _.each($('#create_private_service_form').serializeArray(), function(input) {

                //   //  values[input.name] = input.value;
                //   formData.append(input.name,input.value);
                // });

                var self = this;
                $.ajax({
                    url: '/api/services/privateServices/' + self.model.id,
                    type: 'PUT',
                    data: formData,
                    success: function(data) {
                        if (data.length > 0) {
                            self.model.set(data[0]);
                            self.hideModal();
                            self.showNotification('服务修改成功');
                        }


                    },
                    error: function(error) {

                    },
                    cache: false,
                    contentType: false,
                    processData: false

                });

            }
        }

    });

    return EditPrivateServiceView;
});