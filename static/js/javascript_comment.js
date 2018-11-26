$(document).ready(function () {
    let group_list = [];
    let group_date = [];
    let response_
    axios.get(`/api/Page`)
        .then(response => {
            response = response.data;
            response.forEach(element => {
                group_list.push(element.group)
            });
            $('select#group-selection').append(
                `${group_list.map(e => `<option> ${e} </option>`).join("")}`)
            $('select#page-selection').append(
                `${response[0].page.map(e => `<option> ${e} </option>`).join("")}`)
            response_ = response
            return response_
        })
        .then(response => axios.get(`/api/Date`))
        .then(response => {
            response = response.data;
            response.forEach(element => {
                group_date.push(element.date)
            });
            $('select#date-selection').append(
                `${group_date.map(e => `<option> ${e} </option>`).join("")}`)
        })
        .then(response => renderComment())
        .catch(err => console.log(err))


    $('select#group-selection').on('change', function () {
        $('select#page-selection').empty();
        let tagname = $(`select#group-selection option:selected`).val();
        response_.forEach(element => {
            if (element.group === tagname) {
                $('select#page-selection').append(
                    ` ${element.page.map(e => `<option> ${e} </option>`).join("")}`)
            }
        })
        renderComment()
    });
    $('select#page-selection, select#date-selection').on('change', function () {
        renderComment()
    });


    function renderComment() {
        $('#div-comments-comments').empty();
        $('#div-comments-actions').empty();
        axios.get(`/api/Comment/${$(`select#group-selection option:selected`).val()}/${$(`select#page-selection option:selected`).val()}/${$(`select#date-selection option:selected`).val()}`)
            .then(response => {
                response.data.forEach(element => {
                    if (element.comment != "") {
                        $('#div-comments-comments').append(`
                        <div id="${element._id.$oid}" class="row row-cmt">
                            <div class="col-1 comment-type">Comment:        </div>
                            <textarea class="col comment-content" >${element.comment}</textarea>
                            <button class="btn col-1 edit-comment">Edit</button>
                            <button class="btn btn-danger col-1 delete-comment-action">Delete</button>
                        </div>
                        `)
                    } else {
                        $('#div-comments-actions').append(`
                        <div id="${element._id.$oid}" class="row row-act">
                            <div class="col-1 comment-type">Actiont:        </div>
                            <textarea class="col action-content" >${element.action}</textarea>
                            <button class="btn col-1 edit-action">Edit</button>
                            <button class="btn btn-danger col-1 delete-comment-action">Delete</button>
                        </div>
                        `)
                    }
                })
            })
            .catch(err => console.log('Error', err))
    }
    $(document).on('click', '.btn.edit-comment', function (event) {
        let id = $(this).parent('.row-cmt').attr('id')
        axios.put(`/api/Comment/${id}`, { comment : $(this).siblings('.comment-content').val(), action:"" })
            .then(response => {
                alert("Changed successful !!")
            })
            .catch(err => console.log(err));
    })
    $(document).on('click', '.btn.edit-action', function (event) {
        let id = $(this).parent('.row-act').attr('id')
        axios.put(`/api/Comment/${id}`, { comment : "", action : $(this).siblings('.action-content').val() })
            .then(response => {
                alert("Changed successful !!")
            })
            .catch(err => console.log(err));
    })

    $(document).on('click', '.delete-comment-action', function (event) {
        let id = $(this).parent('.row').attr('id')
        console.log(id)
        axios.delete(`/api/Comment/${id}`)
            .then(response => {
                $(this).parent('.row').remove();
                alert("Comment Deleted !!")
            })
            .catch(err => console.log(err));
    })










});