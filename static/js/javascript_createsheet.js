$(document).ready(function () {
    let group_list = [];
    let group_date = [];
    let response_
    $.ajax({
        url: `/api/Page`,
        type: 'get',
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            response.forEach(element => {
                group_list.push(element.group)
            });
            $('select#group-selection').append(
                `${group_list.map(e => `<option> ${e} </option>`).join("")}`)
            $('select#page-selection').append(
                `${response[0].page.map(e => `<option> ${e} </option>`).join("")}`)
            response_ = response
            return response_
        },
        error: function (response) {
            console.log('Error', response);
        }
    });
    $.ajax({
        url: `/api/Date`,
        type: 'get',
        success: function (response) {
            response = JSON.parse(response);
            console.log(response);
            response.forEach(element => {
                group_date.push(element.date)
            });
            $('select#date-selection').append(
                `${group_date.map(e => `<option> ${e} </option>`).join("")}`)
        },
        error: function (response) {
            console.log('Error', response);
        }
    });

    $('select#group-selection').on('change', function () {
        $('select#page-selection').empty();
        let tagname = $(`select#group-selection option:selected`).val();
        response_.forEach(element => {
            if (element.group === tagname) {
                $('select#page-selection').append(
                    ` ${element.page.map(e => `<option> ${e} </option>`).join("")}`)
            }
        })
    });



    function createSheet(formData) {
        $.ajax({
            url: `/api/Array`,
            type: 'post',
            data: JSON.stringify(formData),
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                console.log(response)
            },
            error: function (response) {
                console.log('Error', response);
            }
        });
    }

    $('#button-create-sheet').click(function (event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("group", $("select#group-selection option:selected").val());
        formData.append("page", $("select#sheet-selection option:selected").val());
        formData.append("date", $("#input-date").val());
        formData.append("sheet", $("#input-sheet").val());
        formData.append("data", $("#customFile")[0].files[0]);
        console.log($("select#group-selection option:selected").val())
        createSheet(formData)
    })








});