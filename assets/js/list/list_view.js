//View для вывода всех новостей
App.module("NewssApp.List", function (List, App, Backbone, Marionette, $, _) {
    List.Layout = Marionette.LayoutView.extend({
        template: "#news-list-layout",

        regions: {
            panelRegion: "#panel-region",
            newssRegion: "#newss-region",
            pagerRegion: "#pages-region"
        }
    });
    //View для верхней панели
    List.Panel = Marionette.ItemView.extend({
        template: "#news-list-panel",

        triggers: {
            "click button.js-new": "news:new"
        }
    });

    //View для пагинации
    List.Pager = Marionette.ItemView.extend({
        template: "#next-page-tmpl",
        
        triggers: {
            "click button.js-next": "news:next",
            "click button.js-prev": "news:prev"
        }
    });

    //View для каждой отдельной строчки(где информация + посмотреть\удалить)
    List.News = Marionette.ItemView.extend({
        tagName: "tr",
        template: "#news-list-item",

        triggers: {
            "click a.js-show": "news:show",
            "click button.js-delete": "news:delete"
        },

        //описание функции удаления
        remove: function () {
            Marionette.ItemView.prototype.remove.call(this);
        }
    });

    List.Newss = Marionette.CompositeView.extend({
        tagName: "table",
        template: "#news-list",
        childView: List.News,
        childViewContainer: "tbody"
    });
});