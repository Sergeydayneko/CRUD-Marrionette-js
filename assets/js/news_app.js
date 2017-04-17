/**
 * @Param Router
 */

//Прописываем на какие url какие будут происходить события, а так же их обработка
App.module("NewssApp", function (NewssApp, App, Backbone, Marionette, $, _) {
    NewssApp.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "newss": "listNewss",
            "newss/:id": "showNews",
            "newss/:id/edit": "editNews"
        }
    });

    var API = {
        listNewss: function () {
            NewssApp.List.Controller.listNewss();
        },

        showNews: function (id) {
            NewssApp.Show.Controller.showNews(id);
        },

        editNews: function (id) {
            NewssApp.Edit.Controller.editNews(id);
        },

        newNews: function () {
            // console.log("new route");
            NewssApp.New.Controller.newNews();
        }
    };

    App.on("newss:list", function () {
        App.navigate("newss");
        API.listNewss();
    });

    App.on("news:show", function (id) {
        App.navigate("newss/" + id);
        API.showNews(id);
    });

    App.on("news:edit", function (id) {
        App.navigate("newss/" + id + "/edit");
        API.editNews(id);
    });

    // delete me
    /*App.on("news:new", function () {
        API.newNews();
    });*/

    NewssApp.on("start", function () {
        new NewssApp.Router({
            controller: API
        });
    });
});
