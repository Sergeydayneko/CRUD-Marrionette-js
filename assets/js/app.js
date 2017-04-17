var App = new Marionette.Application();

/**
 *
 * @param route
 * @param options
 */
App.navigate = function (route, options) {
    options || (options = {});
    Backbone.history.navigate(route, options);
};

//Хэлпер для получения текущего url
App.getCurrentRoute = function () {
    return Backbone.history.fragment
};

//Создаем контейнер регионов
App.on("before:start", function () {
    var RegionContainer = Marionette.LayoutView.extend({
        el: "#app-container",

        regions: {
            main: "#main-region"
        }
    });

    App.regions = new RegionContainer();
});

//При старте приложения запускаем осуществляем запуск истории(для навигации по странице)
App.on("start", function () {
    if (Backbone.history) {
        Backbone.history.start();
    //Если пустой url, то создаем событие newss:list, которое подгрузит все новости на странице
        if (this.getCurrentRoute() === "") {
            App.trigger("newss:list");
        }
    }
});