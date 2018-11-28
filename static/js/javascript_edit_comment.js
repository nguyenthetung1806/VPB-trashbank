$(document).ready(function () {

    axios.get(`/api/Comment_getOne/${$('._id').attr('id')}`)
        .then(response => {
            console.log(response.data.comment);
            response.data.comment != "" ? renderData = response.data.comment : renderData = response.data.action;
            $('.fr-placeholder').remove();
            $('.fr-element.fr-view').empty();
            $('.fr-element.fr-view').append(renderData)
        })
        .catch(err => console.log(err))

    $(document).on('click', '#edit-content', function (event) {
        console.log($(`#config`).text())
        $(`#config`).text().toLowerCase() == "comment"
            ? editData = { comment: $('.fr-element.fr-view').html(), action: "" }
            : editData = { action: $('.fr-element.fr-view').html(), comment: "" }
        console.log(editData)
        console.log(`/api/Comment/${$('._id').attr('id')}`)
        axios.put(`/api/Comment/${$('._id').attr('id')}`, editData)
            .then(response => {
                alert("Changed successful !!")
                history.back();
            })
            .catch(err => console.log(err));
    })




});