$(document).ready(function () {
    console.log('hello')


    function createPage() {
        $.ajax({
            url: `/api/Page`,
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "group": $("#input-group").val(),
                "page": JSON.parse($("#input-page").val()),
            }),
            success: function (response) {
                console.log(response)
                alert("success")
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }


    function createDate() {
        $.ajax({
            url: `/api/Date`,
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "date": $("#input-date").val()
            }),
            success: function (response) {
                console.log(response)
                alert("success")
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }
    $('#button-create-date').click(function (event) {
        event.preventDefault();
        createDate();
    })

    $('#button-create-page').click(function (event) {
        event.preventDefault();
        createPage();
    })






})