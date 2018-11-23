$(document).ready(function () {
    console.log('hello')

    axios.get('/api/Date')
        .then(response => {
            let group_date = []
            response.data.forEach(element => {
                group_date.push(element.date)
            });
            $('select#date-selection').append(
                `${group_date.map(e => `<option> ${e} </option>`).join("")}`)
            return $(`select#date-selection option:selected`).val()
        })
        .then(response => {
            axios.get(`/api/Sheet-Date/${$("#group").text()}/${$("#page_name").text()}/${response}`)
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
                    return $(`select#sheet-selection option:selected`).val()
                })
                .then(response => {
                    getComment()
                    console.log(response)
                })
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
        let thead = array.array[0].map(e => `<th> ${e} </th>`);
        let tbody = []
        for (let i = 1; i < array.array.length; i++) {
            add = array.array[i].map(e => `<td class="${array.page} ${i}"> ${e} </td>`);
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
    }

    function createComment() {
        let comment, action
        if ($(`select#comment-action-selection option:selected`).val() == "Post Comment") {
            comment = $("#input-comment-action").val()
            action = ""
        } else if ($(`select#comment-action-selection option:selected`).val() == "Post Action") {
            comment = ""
            action = $("#input-comment-action").val()
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

    $('#input-comment-action').keypress(function (event) {
        if (event.which == 13) {
            createComment()
            $('#input-comment-action').val("");
            $('#input-comment-action').focus(""); 
            $("#scroll").animate({ scrollTop: $("#comments_and_actions").height() }, "slow");
        }
    })


    function renderComment(element) {
        console.log('comment redering')
        if (element.comment != "") {
            $('#div-comments').append(`
                <div class="col single-data-piece">
                    <div class="comment"> ${element.comment} </div>
                </div> `)
        }
        if (element.action != "") {
            $('#div-actions').append(`
                <div class="col single-data-piece">
                    <div class="Action"> ${element.action} </div>
                </div> `)
        }
    }








})

