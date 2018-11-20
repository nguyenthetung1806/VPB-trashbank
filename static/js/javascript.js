$(document).ready(function () {
    console.log('hello')
    let sheetsRendered

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



    function getComment() {
        axios.get(`/api/Comment/${$("#group").text()}/${$("#page_name").text()}/${$(`select#date-selection option:selected`).val()}/${$(`select#sheet-selection option:selected`).val()}`)
            .then(response => {
                console.log(response)
                response.data.forEach(element => {
                    console.log(element)
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
        axios.post(`/api/Comment`,
            {
                "group": $("#group").text(),
                "page": $("#page_name").text(),
                "date": $(`select#date-selection option:selected`).val(),
                "sheet": $(`select#sheet-selection option:selected`).val(),
                "username": $("#input-username").val(),
                "comment": $("#input-comment").val(),
                "action": $("#input-action").val(),
            })
            .then(response => {
                console.log(response)
                $("#input-username").empty();
                $("#input-comment").empty();
                $("#input-comment").empty();
                $('#comments_and_actions').append(`
                    <div class="single-data-piece">
                        <div class="user"> Posted by: ${response.data.username} </div>
                        <div>Comment:</div>
                        <div class="comment"> ${response.data.comment} </div>
                        ${response.data.action ? "<div>Action:</div>" : ""}
                        <div class="action"> ${response.data.action ? response.data.action : ""} </div>
                    </div>
                 `)
            })
            .catch(err => console.log('Error', err))

    }

    getComment(createComment);
    $('#summit-comment').click(function () {
        createComment()
        $("#scroll").animate({ scrollTop: $("#comments_and_actions").height() }, "slow");
    })


})

