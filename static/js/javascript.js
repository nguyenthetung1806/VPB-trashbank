$(document).ready(function () {
    console.log('hello')

    let page_name = $("#page_name").text();
    function getArray(renderArray) {
        $.ajax({
            url: `/api/Array/${ page_name }`,
            type: 'get',
            success: function (response) {
                let array = JSON.parse(response);
                renderArray(array);
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }
    function getComment(renderComments) {
        $.ajax({
            url: `/api/Comment/${ page_name }`,
            type: 'get',
            success: function (response) {
                let comments = JSON.parse(response);
                renderComments(comments)
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }

    function renderArray(array) {
        let thead = array.array[0].map(e => `<th> ${e} </th>`);
        let tbody = []
        for (let i = 1; i < array.array.length; i++) {
            add = array.array[i].map(e => `<td class="${array.page} ${i}"> ${e} </td>`);
            tbody.push(add.join(""));
        }
        tbody = tbody.map(e => `<tr class="${array.page} ${tbody.indexOf(e)}"> ${e} </tr>`)
        $('#array').append(`
            <table class="table" id="${array.page}">
                <thead>
                <tr>
                    ${ thead.join("")}
                </tr >
                </thead >
                <tbody>
                     ${ tbody.join("")}
                </tbody>
            </table >
        `)
    }

    function renderComments(comments) {
        comments.forEach(element => {
            $('#comments_and_actions').append(`
            <div class="single-data-piece">
                <div class="user"> Posted by: ${element.username} </div>
                <div>Comment:</div>
                <div class="comment"> ${element.comment} </div>
                ${element.action ? "<div>Action:</div>" : ""}
                <div class="action"> ${element.action ? element.action : ""} </div>
            </div>
        `)
        });
    }

    function createComment() {
        $.ajax({
            url: `/api/Comment`,
            type: 'post',
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "page": $("#page_name").text(),
                "username": $("#input-username").val(),
                "comment": $("#input-comment").val(),
                "action": $("#input-comment").val(),
            }),
            success: function (response) {
                $("#input-username").empty();
                $("#input-comment").empty();
                $("#input-comment").empty();
                $('#comments_and_actions').append(`
                    <div class="single-data-piece">
                        <div class="user"> Posted by: ${response.username} </div>
                        <div>Comment:</div>
                        <div class="comment"> ${response.comment} </div>
                        ${response.action ? "<div>Action:</div>" : ""}
                        <div class="action"> ${response.action ? response.action : ""} </div>
                    </div>
                 `)
                $('#scroll').scrollTo({ bottom: '0px', left: '100%' }, 800);
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }

    getArray(renderArray);
    getComment(renderComments);
    $('#summit-comment').click(function () {
        createComment()
        $("#scroll").animate({ scrollTop: $("#comments_and_actions").height() }, "slow");
    })




})