
OperationSystem.app={};
(function(){
    'use strict';

    OperationSystem.app =  {
        root: "/",
        URL: "/",
        API: "",
        showAlert: function(title, text, klass) {
            $("#header-alert").removeClass("alert-danger alert-warning alert-success alert-info");
            $("#header-alert").addClass(klass);
            $("#header-alert").html('<button class="close" data-dismiss="alert">×</button><strong>' + title + '</strong> ' + text);
            $("#header-alert").show('fast');
            setTimeout(function() {
                $("#header-alert").hide();
            }, 7000);
        }
    };

    Backbone.View.prototype.close = function() {

      this.undelegateEvents();
        this.remove();
        this.off();
        if (this.onClose) {
            this.onClose();
        }
    };


})();



