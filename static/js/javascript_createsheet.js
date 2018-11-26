$(document).ready(function () {
    let group_list = [];
    let group_date = [];
    let response_
    $.ajax({
        url: `/api/Page`,
        type: 'get',
        success: function (response) {
            response = JSON.parse(response);
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
        axios.post(`/api/Sheet`, formData, { responseType: 'arraybuffer' }, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                console.log(response);
                alert('success')
            })
            .catch(err => {
                console.log(err)
                alert('Something was wrong !!! Please try again !!!')
            });
    }

    $("#customFile").change(function () {
        $("#input-sheet").val($('input[type=file]').val().replace(/C:\\fakepath\\/i, '').split('.').slice(0, -1).join('.'))
        $("#input-label").text($('input[type=file]').val().replace(/C:\\fakepath\\/i, ''))
    })

    $('#button-create-sheet').click(function (event) {
        event.preventDefault();
        var formData = new FormData();
        formData.append("group", $("select#group-selection option:selected").val());
        formData.append("page", $("select#page-selection option:selected").val());
        formData.append("date", $("select#date-selection option:selected").val());
        formData.append("sheet", $("#input-sheet").val());
        formData.append("data", $("#customFile")[0].files[0]);
        createSheet(formData)
    })








});