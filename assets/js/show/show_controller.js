
//Контроллер получения и обработки 1 новости
App.module("NewssApp.Show", function (Show, App, Backbone, Marionette, $, _) {
    Show.Controller = {
        showNews: function (id) {
            
            var fetchingNews = App.request("news:entity", id);
            $.when(fetchingNews).done(function (news) {
                var newsView = new Show.News({
                    model: news
                });

                newsView.on("news:edit", function (news) {
                    App.trigger("news:edit", news.get("id"));
                });

                App.regions.main.show(newsView);
            });
        }
    }
});