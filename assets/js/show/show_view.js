//View для 1 новости
App.module("NewssApp.Show", function (Show, App, Backbone, Marionette, $, _) {

    Show.News = Marionette.ItemView.extend({
        template: "#news-view",

        events: {
            "click a.js-edit": "editClicked"
        },

        editClicked: function (e) {
            e.preventDefault();
            this.trigger("news:edit", this.model);
        }
    });
});
