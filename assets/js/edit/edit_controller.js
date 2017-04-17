//Контроллер для редактирования

App.module("NewssApp.Edit", function (Edit, App, Backbone, Marionette, $, _) {
    Edit.Controller = {
        editNews: function (id) {
            var fetchingNews = App.request("news:entity", id);
            $.when(fetchingNews).done(function (news) {
                var view = new App.NewssApp.Common.Views.Form({
                    model: news
                });

                view.on("form:submit", function (data) {
                    if (news.save(data)) {
                        App.trigger("news:show", news.get("id"));
                    }
                    else {
                        view.triggerMethod("form:data:invalid", news.validationError);
                    }
                });

                App.regions.main.show(view);
            });
        }
    };
});