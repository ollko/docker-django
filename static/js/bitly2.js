$(document).ready(function() {
    var modelData = {
        currentPageEndpoint: null,
        paginationTotalPages: null,
        paginationButtonBlocked: false,
        blockButton: false
    };

    var octopus = {
        init: function() {
            formView.init();
            urlListView.init();
        },

        getUserId: function() {
            return $('#user-id').text();
        },

        getcurrentUrlEndpoint: function() {
            return modelData.currentPageEndpoint;
        },

        get: function( url ) {
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
        },

        post: function( url, data ) {
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
                        console.log('reg.status = ',reg.response)
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
        },

        setPagination: function(data) {               
            var userId = octopus.getUserId();
            var totalPages = data.total_pages;         
            var $pagination = $('.pagination');
            $pagination.children().remove();
            
            for (var i=1; i<=totalPages; i++){
                $pagination.append (
                    `<li class="page-item page-item-button" id="page-item-${i}"><a class="page-link"  href="#">${i}</a></li>`
                );
            };

            $pagination.on('click', 'li.page-item-button', function() {
                
                if ( ! modelData.paginationButtonBlocked ) {
                    modelData.paginationButtonBlocked = true;
                    var buttonNumber = $( this ).text();
                    var currentPageEndpoint = `/api/${ userId }/?page=${buttonNumber}`;
                    urlListView.render(currentPageEndpoint);
                    
                }; 
                
                setTimeout(function(){
                                    modelData.paginationButtonBlocked = false;
                                    }, 500);
                
            });
           
        },

        setPreviousNextPaginationButtons: function(previous, next) {
            var $pagination = $('.pagination');
            $('.pagination-row').remove();

            if ( previous ) {
                $pagination.prepend (
                `<li class="page-item pagination-row" id="page-previous">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                `
                );
                $('#page-previous').click( function() {
                    urlListView.render( previous );
                            
                });
            } else {
                $pagination.prepend (
                `<li class="page-item pagination-row disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">&laquo;</a>
                </li>
                `
                );
            }

            $('#page-next').remove();
            if ( next ) {
                $pagination.append (
                `<li class="page-item pagination-row" id="page-next">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
                `
                );
                $('#page-next').click( function() {
                    urlListView.render( next );
                });
            } else {
                $pagination.append (
                `<li class="page-item pagination-row disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">&raquo;</a>
                </li>
                `
                );
            }
        },

        setListOfUrlForCurrentUser: function(data) {
            var self = this;
            var host = window.location.host;
            var $urlContainer = $('#url-container');
            $urlContainer.children().remove();
            data.results.forEach( (item, index) => {
                setTimeout(function() {
                    $urlContainer.append (
                        `<div class="row justify-content-md-center url-block ">
                            <div class="col-md-7 data-url-block">
                                <div >
                                    <div class="float-left">
                                        <small class="text-muted">
                                            ${ self.getDateTime(item.created) }
                                        </small>
                                    </div>

                                    
                                </div>
                                <br>
                                <div><b>${ item.long_url }</b></div>
                                <div>
                                    
                                    <div class="float-left short-url">${ host }/${ item.short_url_subpart }</div>
                                    <div class="float-right"><span class="icon-bin text-muted"></span></div>

                                </div>
                            </div>
                        </div>`
                    );
                }, index * 100)
            });
            console.log('page-item-' + data.current_page_number);
            $('.page-item.active').removeClass('active');
            $( '#page-item-' + data.current_page_number ).addClass('active');
        },

        getDateTime: function(str) {
            reg = /\d+/g;
            str = str.match(reg)
            '2019-07-17T13:50:42.555872Z'
            return str[2]+"-"+str[1]+"-"+str[0]+"  "+str[3]+":"+str[4]+":"+str[5]

        },

        // --- Form methods ---
        SerializeArrayToJson: function(formData) { //serialize data function
            var data = {};
            for (var i = 0; i < formData.length; i++){
                data[formData[i]['name']] = formData[i]['value'];
            }

            data.user_id = this.getUserId();
                return JSON.stringify(data)
        },

        setErrorMessagesToForm: function(error) {
            var err = error.response;
            $('.form-group-error').remove();
            for ( var key in err ) {
                newEl = $( "<small>" ,{
                    class: 'form-group-error form-text text-danger ',
                    text: err[ key ]
                });
                if ( key != 'non_field_errors' ) {
                    $('#form-group-' + key).append(newEl);
                } else {
                    $('#form-group-long_url').prepend(newEl)
                }
            }
        },
    };

    var formView = {
        init: function() {
            var urlForm = $('#url-form');
            urlForm.submit(function(event){
                event.preventDefault();
                var formData = $(this).serializeArray();
                jsonData = octopus.SerializeArrayToJson(formData);
                var userId = $('#user-id').text();
                console.log('jsonData = ', jsonData);

                if ( ! modelData.blockButton ) {
                    modelData.blockButton = true;
                    setTimeout( function() {
                        modelData.blockButton = false;
                    }, 500 )
                    octopus.post( '/api/', jsonData )
                    .then(function(response) {
                        $('.form-group-error').remove();
                        urlListView.render(`/api/${userId}`);
                        
                    }, function(error){
                        octopus.setErrorMessagesToForm(error);
                    })
                    .then(function($formData) {
                        urlForm[0].reset();
                        console.log("All done!");
                    })
                };
            });
        }
    };

    var urlListView = {
        init: function() {
            var userId = octopus.getUserId();
            modelData.currentPageEndpoint = `/api/${ userId }/?page=1`;
            
            this.render( modelData.currentPageEndpoint );
            
        },

        render: function( currentPageEndpoint ) {
            modelData.paginationButtonBlocked === true;
            octopus.get( currentPageEndpoint )
            .then( function(data) {
                if ( 
                        (! modelData.pagination_total_pages  && ( data.total_pages > 1))
                        || ( data.total_pages > modelData.pagination_total_pages )
                    ) {
                        octopus.setPagination(data);
                        modelData.pagination_total_pages = data.total_pages; 
                }
             
                octopus.setListOfUrlForCurrentUser(data);
                if (data.total_pages > 1) {
                    octopus.setPreviousNextPaginationButtons( data.previous, data.next );
                }

                }, function(error) {
                    console.log(
                        `status: ${error.status}, response: ${error.response}`);
                }
            );
        }
    }

    octopus.init();
})

// <div class="float-right">
//     <span class="icon-telegram icons"></span>
//     <span class="icon-whatsapp icons"></span>
    
// </div>
