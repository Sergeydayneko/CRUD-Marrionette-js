App.module("NewssApp.Common.Views", function (Views, App, Backbone, Marionette, $, _) { //вьюха для добавление и редактирования
    Views.Form = Marionette.ItemView.extend({
        template: "#news-form",

        events: {
            "click button.js-submit": "submitClicked"
        },

        submitClicked: function (e) {
            //Предотвращает переход
            e.preventDefault();
            //this в serialization указывает на текущую форму(#news-form)
            var data = Backbone.Syphon.serialize(this); //запаковывает данные формы в JSON. В JQuery, нам пришлсоь бы использовать .val для каждого и вручную использовать функицю запаковки формы в JSON(енкод, декод)
           //На нашу форму вешается обработчик событий и в него передается data
            this.trigger("form:submit", data);
        },

        //errors приходят из news.js
        onFormDataInvalid: function (errors) {
            //создаем доступ к форме
            var $view = this.$el;
            //очистка от предыдущих ошибок
            var clearFormErrors = function () {
                var $form = $view.find("form");
                $form.find(".help-inline.error").each(function () { //Кверивский запрос, находим ээлемент в котором находится текст ошиьки и удаляем его.
                    $(this).remove();
                });
                $form.find(".control-group.error").each(function () { //ТОже самое для второго поля
                    $(this).removeClass("error");
                });
            };
            //Добавление ошибок
            var markErrors = function (value, key) {
                var $controlGroup = $view.find("#news-" + key).parent();
                //текст ошибки(определяется валидатором)
                var $errorEl = $("<span>", {class: "help-inline error", text: value});
                $controlGroup.append($errorEl).addClass("error");
            };

            clearFormErrors();
            _.each(errors, markErrors);
        }
    });
});
