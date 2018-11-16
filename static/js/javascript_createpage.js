$(document).ready(function () {
    console.log('hello')


    function createPage() {
        $.ajax({
            url: `/api/Page`,
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "page": $("#input-page").val(),
            }),
            success: function (response) {
                console.log(response)
                window.location.replace(`/page/${response.page}`);
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }
    function createArray(createPage) {
        $.ajax({
            url: `/api/Array`,
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "page": $("#input-page").val(),
                "array": JSON.parse($("#input-array").val())
            }),
            success: function (response) {
                console.log(response)
                createPage();
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }
    $('#button-create-page').click(function (event) {
        event.preventDefault();
        createArray(createPage);
    })






})