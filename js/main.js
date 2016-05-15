
// Returns the current datetime as a unix timestamp
function getUnixTimeStamp() {
    return new Date().valueOf();
}

function addTodoElement(item) {

    listItem = $('<li/>', {
        "class": "task-item all show "+item.status,
        "data-timestamp": item.updated_at
    }).prependTo(".task-list ul");

    btnContainer = $("<div />", {
        "class" : "task-item-actions",
    }).appendTo(listItem);

    $("<a />", {
        "href": "javascript:void(0);",
        "class" : "button remove-todo-item",
        "html" : "&times;"
    }).appendTo(btnContainer);

    $("<a />", {
        "href": "javascript:void(0);",
        "class" : "button check mark-done-item",
        "html" : "&#10003;" /* &check; cannot be used becuase of IE 9 quirk */ 
    }).appendTo(btnContainer);

    taskItemContent = $("<div />", {
        "class": "task-item-content",
    }).appendTo(listItem);  

    $("<span />", {
        "text": item.description
    }).appendTo(taskItemContent);  

}


var todoItems;


$(function() {

    // Checking if todoData exists in local storage exists
    // and if not load data from data.json   

    if (localStorage.getItem("todoData") === null) {

        $.ajax({
            url: "data/data.json",
            dataType: 'json',
            async: false,
            success: function(todoData) {

                localStorage.setItem("todoData", JSON.stringify(todoData));
                todoItems = JSON.parse(localStorage.getItem("todoData"));

                $.each(todoItems.items, function (key, item) {
                    addTodoElement(item);
                });

            }
        });

    }

    else {

        todoItems = JSON.parse(localStorage.getItem("todoData"))

        $.each(todoItems.items, function (key, item) {
            addTodoElement(item);
        });
    }



    // Add a new Todo item from the text field
    $('#todo-form').submit(function () {


        if ($('#todo-form-field').val() !== "") { // check if text field is empty

            var taskDateCreated = getUnixTimeStamp();
            var taskMessage = $('#todo-form-field').val();
            
            $('#todo-form-field').val("").focus(); /* empty field and refocus on textfield */

            // create todo object
            var newItem = {updated_at:taskDateCreated, description:taskMessage, status:"todo"};

            // prepend to existing list in DOM
            addTodoElement(newItem);

            // push todo object into array
            todoItems.items.push(newItem);
            // update local storage with the latest addition
            localStorage.setItem("todoData", JSON.stringify(todoItems));
        }
        // stop form from submitting
        return false;
    });


    // click event for remove button

    $(".task-list").on("click", ".remove-todo-item", function() {

        var $element = $(this).parents(".task-item");
        var taskDateCreated = $element.data("timestamp");

        
        indexes = $.map(todoItems.items, function(e, index) {
            if(e.updated_at === taskDateCreated) {
                return index;
            }
        });

        todoItems.items[indexes[0]].status = "removed";

        $element.removeClass().addClass("task-item all removed");

        localStorage.setItem("todoData", JSON.stringify(todoItems));

    });

    // click event for done button
    $(".task-list").on("click", ".mark-done-item", function() {

        var $element = $(this).parents(".task-item");
        var taskDateCreated = $element.data("timestamp");

        indexes = $.map(todoItems.items, function(e, index) {
            if(e.updated_at === taskDateCreated) {
                return index;
            }
        });

        todoItems.items[indexes[0]].status = "done";

        $element.removeClass().addClass("task-item all done");
        localStorage.setItem("todoData", JSON.stringify(todoItems));
    });


    // Switch between categories using Tabs
    $("li","nav").on("click",function(e) {
        e.preventDefault();
        $(this).siblings().find("a").removeClass("selected");
        $(this).find("a").addClass("selected");

        var category = $(this).find("a").data("category");

        $(".task-list ul .task-item").hide();
        $('.task-item.'+category, ".task-list ul").show();
    });



});