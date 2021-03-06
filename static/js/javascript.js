$(document).ready(function () {
    console.log('hello')
    axios.get('/api/Date')
        .then(response => {
            let group_date = []
            response.data.forEach(element => {
                group_date.push(element.date)
            });
            $('select#date-selection').append(
                `${group_date.map(e => `<option>${e}</option>`).join("")}`)
            return $(`select#date-selection option:selected`).val()
        })
        .then(response => axios.get(`/api/Sheet-Date/${$("#group").text()}/${$("#page_name").text()}/${response}`))
        .then(response => {
            let hidden
            response.data.forEach(element => {
                $('select#sheet-selection').append(
                    ` ${`<option>${element.sheet}</option>`}`)
                response.data.indexOf(element) === 0 ? hidden = 0 : hidden = 1
                renderArray(element, hidden)
            })
            return $(`select#sheet-selection option:selected`).val()
        })
        .then(response => {
            getComment()
            console.log(response)
        })
        .catch(err => console.log(err))

    $(`select#sheet-selection`).on('change', function () {
        $(`#table-array-${$(`select#sheet-selection option:not(:selected)`).val()}`).addClass("hidden")
        console.log(`#table-array-${$(`select#sheet-selection option:selected`).val()}`)
        $(`#table-array-${$(`select#sheet-selection option:selected`).val()}`).removeClass("hidden")
    })

    $(`select#date-selection`).on('change', function () {
        $('#div-comments').empty();
        $('#div-actions').empty();
        $('#array').empty();
        $('select#sheet-selection').empty();
        getComment();
        axios.get(`/api/Sheet-Date/${$("#group").text()}/${$("#page_name").text()}/${$(`select#date-selection option:selected`).val()}`)
            .then(response => {
                let hidden
                response.data.forEach(element => {
                    console.log(element)
                    $('select#sheet-selection').append(
                        ` ${`<option>${element.sheet}</option>`}`)
                    response.data.indexOf(element) === 0 ? hidden = 0 : hidden = 1
                    console.log(response.data.indexOf(element))
                    renderArray(element, hidden)
                })
            })
            .then(response => {
                getComment()
                console.log(response)
            })
            .catch(err => console.log(err))


    })


    function getComment() {
        axios.get(`/api/Comment/${$("#group").text()}/${$("#page_name").text()}/${$(`select#date-selection option:selected`).val()}`)
            .then(response => {
                console.log(response)
                response.data.forEach(element => {
                    renderComment(element)
                });
            })
            .catch(err => console.log('Error', err))
    }

    function renderArray(array, hidden) {
        let renderArray = array.array
        let thead = renderArray[0].map(e => `<th> ${e} </th>`);
        let tbody = []
        for (let i = 1; i < renderArray.length; i++) {
            add = renderArray[i].map((e, index) => {
                let cellValue = e;
                if (parseFloat(e)) {
                    if (renderArray[0][index].includes('%') || renderArray[i][0].includes('%')) {
                        cellValue = Math.round(parseFloat(e * 100)) + " %"
                    } else {
                        cellValue = Math.round(parseFloat(e))
                        cellValue = cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                }
                return `<td row="${renderArray[i][0]}" column="${renderArray[0][index]}" class="${array.page} ${i}"> ${cellValue} </td>`
            });
            tbody.push(add.join(""));
        }
        tbody = tbody.map(e => `<tr class="${array.page} ${tbody.indexOf(e)}"> ${e} </tr>`)
        $('#array').append(`
            <table class="table ${(hidden === 1) ? "hidden" : ""}" id="table-array-${array.sheet}">
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
        FormatCell();
    }

    function createComment(content) {
        let comment, action
        if ($(`select#comment-action-selection option:selected`).val() == "Post Comment") {
            comment = content
            action = ""
        } else if ($(`select#comment-action-selection option:selected`).val() == "Post Action") {
            comment = ""
            action = content
        }
        axios.post(`/api/Comment`,
            {
                "group": $("#group").text(),
                "page": $("#page_name").text(),
                "date": $(`select#date-selection option:selected`).val(),
                "comment": comment,
                "action": action
            })
            .then(response => {
                console.log(response)
                $("#input-comment").empty();
                $("#input-comment").empty();
                renderComment(response.data)
            })
            .catch(err => console.log('Error', err))
    }

    $(document).on('click', '#post-content', function () {
        let content = $('.fr-element.fr-view').html()
        console.log(content)
        console.log('create')
        createComment(content)
        $('.fr-element.fr-view').empty();
    })



    function renderComment(element) {
        if (element.comment != "") {
            $('#div-comments').append(`
            <div class="whole-piece">
                <div class="row single-data-piece">
                    <div class="col comment"> ${element.comment} </div>
                </div> 
                <div class="row">
                    <div id="Comment/${element._id.$oid}" class="col edit-btn"> Edit </div>
                    <div id="${element._id.$oid}" class="col delete-btn"> Delete </div>
                </div>
            </div>
                `)
        }
        if (element.action != "") {
            $('#div-actions').append(`
            <div class="whole-piece">
                <div class="row single-data-piece">
                    <div class="Action"> ${element.action} </div>
                </div> 
                <div class="row">
                    <div id="Action/${element._id.$oid}" class="col edit-btn"> Edit </div>
                    <div id="${element._id.$oid}" class="col delete-btn"> Delete </div>
                </div>
            </div>
                `)
        }
    }


    // create modal for delete button
    $(document).on('click', '.delete-btn', function (event) {
        let id = $(this).attr('id')
        $('#modal').append(`    
        <div class="modal fade show" style ="display: block; padding-right: 16px;">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete Comment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span class="close-modal" aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                ${ $(this).parent('.row').siblings('.row.single-data-piece').html()}
                </div>
                <div class="modal-footer">
                    <button type="button" class="close-modal btn btn-secondary" data-dismiss="modal">Close</button>
                    <button cmt-act-id="${id}" type="button" class="modal-level delete btn btn-danger">Delete Comment</button>
                </div>
            </div>
            </div>
        </div>`)
    })

    //  actually remove the content
    $(document).on('click', '.close-modal', function (event) {
        $('#modal').empty();
    });

    $(document).on('click', '.modal-level.delete', function (event) {
        let id = $(this).attr('cmt-act-id')
        axios.delete(`/api/Comment/${id}`)
            .then(response => {
                $('#modal').empty();
                $(`#${id}`).parent('.row').parent('.whole-piece').remove();
            })
            .catch(err => console.log(err));
    });

    $(document).on('click', '.edit-btn', function (event) {
        window.location.href = `/comment/edit/${$(this).attr('id')}`;
    })





    // format cell condition
    // Write format functions inside: FormatCell () {  ....functions...  }
    function FormatCell() {

        // Example
        $('td').each(function () {
            if (parseFloat($(this).text()) < 0) {
                $(this).css({ "color": "red" })
            }
        });
        // Example End


    }




})

