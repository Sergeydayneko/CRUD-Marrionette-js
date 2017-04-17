/**
 * @Param Model
 */

App.module("Entities", function (Entities, App, Backbone, Marionette, $, _) {

    Entities.News = Backbone.Model.extend({
        urlRoot: "api.php/newss",

        defaults: {
            title: "",
            text: "",
            author: ""
        },
        //валидация на заполнение при редактировании
        validate: function (attrs, options) {
            var errors = {};
            if (!attrs.title) {
                errors.title = "обязательно";
            }
            if (!attrs.text) {
                errors.text = "обязательно";
            }
            else {
                if (attrs.text.length < 2) {
                    errors.text = "слишком короткий";
                }
            }
            if (!_.isEmpty(errors)) {
                return errors;
            }
        }
    });

    //Создаем коллекцию с возможностью пагинации
    Entities.NewsCollection = Backbone.PageableCollection.extend({
        url: "api.php/newss",
        model: Entities.News,

        //определяем количество страниц
        parse: function(response) {
            console.log(response.meta.totalCount);
            this.state.totalRecords = response.meta.totalCount;
            this.state.totalPages = this.state.totalRecords / 2;
            this.state.lastPage = this.state.totalPages;
            //console.log(this.state);
            return response.data;
        },

        state: {
            pageSize: 2
        },

        queryParams: {
            currentPage: null,
            pageSize: "limit",
            start: function () {
                return this.state.currentPage * 2 - 2;
            }
        }
    });
    //Описываются функции для вывода 1 новости и всех новостей
    var API = {
        getNewsEntities: function () {
            var newss = new Entities.NewsCollection();
            //defer помогает возвращать новость, когда она уже пришли с сервера, чтобы не получился вывод белого экрана
            var defer = $.Deferred();
            newss.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        },

        getNewsEntity: function (newsId) {
            var news = new Entities.News({id: newsId});
            var defer = $.Deferred();
            news.fetch({
                success: function (data) {
                    defer.resolve(data);
                }
            });
            return defer.promise();
        }
    };

    //Вешаем хэндлеры на соответствующие события, делегируем их обработку в API
    App.reqres.setHandler("news:entities", function () {
        return API.getNewsEntities();
    });

    App.reqres.setHandler("news:entity", function (id) {
        return API.getNewsEntity(id);
    });
});
