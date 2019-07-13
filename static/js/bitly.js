$(document).ready(function(){
    var userId = $('#user-id').text();
    var $urlForm = $('#url-form');


    if ( userId ) {
        get( `/api/${ userId }` ).then( function(data) {
            setPagination(data);
            setListOfUrlForCurrentUser(data);
        }, function(error) {
             console.log(`status: ${error.status}, response: ${error.response}`);
        });
    }

    function bindPaginationButton(buttonNumber) {
        var userId = $('#user-id').text();
        var button = '#page-item-' + buttonNumber;
        $(button).click(function() {
            get( `/api/${ userId }/?page=${buttonNumber}` )
                .then( function(data) {
                    setListOfUrlForCurrentUser(data);
                }, function(error) {
                    console.log(`status: ${error.status}, response: ${error.response}`);
                });
        })
    }
        
    function setPagination(data) {
        var $paginationContainer = $('#pagination-container');
        var dataNext = data.next;
        var dataPrevious = data.previous;
        var resultsLength = data.results.length;
        var pageNumbers = Math.ceil(data.count/resultsLength);
        if (dataNext || dataPrevious) {
            var $pagination = $('.pagination');
            $pagination.append (
                `<li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                `
                );
                // bindPaginationButton(1);
            for (var i=1; i<=pageNumbers; i++){
                $pagination.append (
                    `<li class="page-item" id="page-item-${i}"><a class="page-link"  href="#">${i}</a></li>`
                );
                bindPaginationButton(i);
            }
            $pagination.append (
                `<li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
                `
                );
            // bindPaginationButton(pageNumbers);
        }
    }

    function setListOfUrlForCurrentUser( data ) {
        
        var $urlContainer = $('#url-container');
        $urlContainer.children().remove();
        data.results.forEach( (item, index) => {
            $urlContainer.append (
                `<div class="row justify-content-md-center url-block ">
                    <div class="col-md-7 data-url-block">
                    <time class="bitlink-item--created-date" datetime="2019-06-28">Jun 28</time>
                        <p>${ item.created }</p>
                        <p>${ item.long_url }</p>
                        <p >
                            <div class="col">
                                <a href="${ item.long_url }">${ item.short_url_subpart }</a>
                            </div>                      
                        </p>
                    </div>
                </div>`
            );
        });
    }

    $urlForm.submit(function(event){
        event.preventDefault();
        var $formData = $(this).serializeArray();
        jsonData = SerializeArrayToJson($formData);
        var userId = $('#user-id').text();

        post( '/api/', jsonData )
            .then(function(response) {
                AddNewUrlPair(response.response);
            }, function(error){
                setErrorMessagesToForm(error);
            })
            .then(function($formData) {
                $urlForm[0].reset();
                console.log("All done!");
            })
    })
})

function AddNewUrlPair(item) {
    return new Promise(function(resolve, reject) {
        var $urlContainer = $('#url-container');
        $urlContainer.prepend(
            `<div class="row justify-content-md-center url-block animated bounceInLeft">
                <div class="col-md-7 data-url-block">
                <time class="bitlink-item--created-date" datetime="2019-06-28">Jun 28</time>
                    <p>${ item.created }</p>
                    <p>${ item.long_url }</p>
                    <p><a href="${ item.long_url }">${ item.short_url_subpart }</a></p>
                </div>
            </div>`
        );
        setTimeout(function() {
            $('.url-block:first').removeClass('animated bounceInLeft');
        }, 2000)
    })
}
    
function setErrorMessagesToForm(error){
    err = error.response;
    $('.form-group-error').remove()
    for ( var key in err ) {
        newEl = $( "<small>" ,{
            class: 'form-group-error form-text text-danger ',
            text: err[ key ]
        });
        $('#form-group-' + key).append(newEl);
    }
}

function SerializeArrayToJson(formData) {//serialize data function
    var data = {};
    for (var i = 0; i < formData.length; i++){
        data[formData[i]['name']] = formData[i]['value'];
    }

    data.user_id = $('#user-id').text();
        return JSON.stringify(data)
    }


function get( url ) {
    return new Promise(function(resolve, reject) {
        var reg = new XMLHttpRequest();
        reg.open('GET', url, true);
        reg.onload = function() {
            if (reg.readyState == 4 && reg.status == 200) {
                console.log(reg.statusText)
                console.log(reg.response)
                resolve(JSON.parse(reg.response));
            } else {
                console.log('reg.readyState = ',reg.readyState)
                console.log('reg.status = ',reg.status)
                reject({
                    status: this.status,
                    response: JSON.parse(reg.response)
                });
            }
        };
        reg.onerror = function() {
            reject(Error('Network Error'));
        };
        reg.send(null);
    })
}

function post(url, data) {
    return new Promise(function(resolve, reject) {
        var reg = new XMLHttpRequest();
        reg.open('POST', url, true);
        reg.setRequestHeader('Content-type','application/json; charset=utf-8');
        reg.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));

        reg.onload = function() {
            if (reg.readyState == 4 && reg.status == 201) {
                console.log(reg.statusText)
                console.log(reg.response)
                resolve({
                    status: this.status,
                    response: JSON.parse(reg.response)
                });
            } else {
                console.log('reg.readyState = ',reg.readyState)
                console.log('reg.status = ',reg.status)
                reject({
                    status: this.status,
                    response: JSON.parse(reg.response)
                });
            }
        };
        reg.onerror = function() {
            reject(Error('Network Error'));
        };
        reg.send(data);
    })
};
