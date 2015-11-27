/*global define*/
OperationSystem.Views = OperationSystem.Views ||{};
OperationSystem.Views.o2oServices = OperationSystem.Views.o2oServices ||{};

(function(){
    'use strict';
    OperationSystem.Views.o2oServices.EditO2oServiceView = Backbone.View.extend({
        template: JST['app/scripts/templates/o2oServices/editO2oService.ejs'],


        events: {
            'click #cancel_edit': 'cancelEdit',
            'click #confirm_edit': 'confirmEdit',
            'click #add-logo-button': 'uploadLogo',
            'change #logo_file': 'previewLogo'
        },

        initialize: function() {
            //        this.listenTo(this.model, 'change', this.render);
            _.bindAll(this);
        },

        render: function() {
            console.log(this.model);

            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        cancelEdit: function(e) {
            e.preventDefault();
            this.parentView.hideModal();
        },
        previewLogo: function(e) {
            e.preventDefault();

            var prevDiv = $('.logo-box-image');
            var file = $('#logo_file')[0];

            if (!file.files[0]) {
                prevDiv.html('');
                return false;
            }

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

        confirmEdit: function(e) {
            e.preventDefault();
            var instance = this.$el.find('#edit_o2o_service_form');
            instance.parsley().validate();

            if (instance.parsley().isValid()) {


                // this.model.set('communityname', $('#create_community_name').val());
                // this.model.set('citycode', $('#new_city_selector').val());
                // this.model.set('areacode', $('#new_district_selector').val());
                // this.model.set('gpslng', $('#gpslng').val());
                // this.model.set('gpslat', $('#gpslat').val());
                // this.model.validate();

                //  var values = {};

                var formData = new FormData($('#edit_o2o_service_form')[0]);

                // _.each($('#create_private_service_form').serializeArray(), function(input) {

                //   //  values[input.name] = input.value;
                //   formData.append(input.name,input.value);
                // });


                var self = this;

                $.ajax({
                    url: '/api/services/o2oServices/' + self.model.get('id'),
                    type: 'PUT',
                    data: formData,
                    success: function(data) {
                        if (data.length > 0) {
                            self.model.set(data[0]);
                            self.parentView.hideModal();
                            self.parentView.showNotification('服务修改成功');
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
})();

