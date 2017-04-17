/**
 * @Controller
 */

//Контроллер для обработки и получения всех новостей
App.module("NewssApp.List", function (List, App, Backbone, Marionette, $, _) {
    List.Controller = {
        listNewss: function () {

            var fetchingNewss = App.request("news:entities");
            var newssListLayout = new List.Layout();
            var newssListPanel = new List.Panel();
            $.when(fetchingNewss).done(function (newss) {
                var newssListView = new List.Newss({
                    collection: newss
                });

                var newssListPager = new List.Pager();

                newssListLayout.on("show", function () {
                    newssListLayout.panelRegion.show(newssListPanel);
                    newssListLayout.pagerRegion.show(newssListPager);
                    newssListLayout.newssRegion.show(newssListView);
                });

                newssListPager.on("news:next", function () {

                    console.log(newss.state);
                    if (newss.hasNextPage()) {
                        newss.getNextPage({fetch: true});
                    } else {
                        console.log("last!");
                    }
                });

                newssListPager.on("news:prev", function () {
                    if (newss.hasPreviousPage()) {
                        newss.getPreviousPage({fetch: true});
                    } else {
                        console.log("first!");
                    }
                });
                
                newssListPanel.on("news:new", function () {
                    var newNews = new App.Entities.News();

                    var view = new App.NewssApp.Common.Views.Form({
                        model: newNews
                    });

                    view.on("form:submit", function (data) {
                        var res = newNews.save(data, {
                            success: function (model, response) {
                                newss.add(model);
                                App.trigger("newss:list");
                            }
                        });
                        if (!res) {
                            view.triggerMethod("form:data:invalid", newNews.validationError);
                        }
                    });

                    App.regions.main.show(view);
                });

                newssListView.on("childview:news:show", function (childView, args) {
                    App.trigger("news:show", args.model.get("id"));
                });

                newssListView.on("childview:news:delete", function (childView, args) {
                    args.model.destroy();
                });

                App.regions.main.show(newssListLayout);
            });
        }
    }
});
