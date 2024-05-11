
$(document).ready(function(){
    $('.side-item').click(function(){
        $('.side-item').not(this).find('a').removeClass('active');
        $(this).find('a').toggleClass('active');
    });

    $(document).on('click', '.text-end', function(){
        console.log('click text end');
        $('.text-end').not(this).find('.list-action_dropdown').removeClass('show');
        $(this).find('.list-action_dropdown').toggleClass('show');
    });

});


$(document).ready(function() {
    fetchData(0, 10); 
    var currentPage = 0;
    var totalPage = 1;
    $('#page-size').change(function() {
        fetchData(0, $(this).val()); 
    });

    function fetchData(page, size) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/register-certificates/all/pagition',
            type: 'GET',
            data: { page: page, size: size },
            dataType: 'json',
            success: function(response) {
                totalPage = response.totalPages;

                updateTable(response);
                $('#cur-page').text(page +1);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }

    function updateTable(data) {
        $('#table-body').empty();
        $.each(data.content, function(index, item) {
            var rowClass = index % 2 === 0 ? 'odd' : 'edd'; 
            var row = $('<tr>').addClass(rowClass);
            row.append($('<td>').text(item.name));
            row.append($('<td>').text(item.id));
            row.append($('<td>').text(item.email));
            row.append($('<td>').text(item.phone));
            row.append($('<td>').text(item.date_register));
            row.append($('<td>').text(item.status));

            var actionCell = $('<td>').addClass('text-end');
                actionCell.html(`
                    <div class="dropdown">
                        <div class="action_dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                                <rect width="16" height="16" fill="none" />
                                <g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                                    <circle cx="8" cy="2.5" r=".75" />
                                    <circle cx="8" cy="8" r=".75" />
                                    <circle cx="8" cy="13.5" r=".75" />
                                </g>
                            </svg>
                            <div class="list-action_dropdown">
                                <ul>
                                    <li>
                                        <label for="open_close" class='action' id='btn-edit'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 26">
                                                <rect width="26" height="26" fill="none" />
                                                <path fill="#000" d="M20.094.25a2.245 2.245 0 0 0-1.625.656l-1 1.031l6.593 6.625l1-1.03a2.319 2.319 0 0 0 0-3.282L21.75.937A2.36 2.36 0 0 0 20.094.25m-3.75 2.594l-1.563 1.5l6.875 6.875L23.25 9.75zM13.78 5.438L2.97 16.155a.975.975 0 0 0-.5.625L.156 24.625a.975.975 0 0 0 1.219 1.219l7.844-2.313a.975.975 0 0 0 .781-.656l10.656-10.563l-1.468-1.468L8.25 21.813l-4.406 1.28l-.938-.937l1.344-4.593L15.094 6.75zm2.375 2.406l-10.968 11l1.593.343l.219 1.47l11-10.97z" />
                                            </svg>
                                            Edit
                                        </label>
                                    </li>
                                    <li>
                                        <label for="open_close" class='action' id='btn-delete' >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 26">
                                                <rect width="26" height="26" fill="none" />
                                                <path fill="#000" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" />
                                            </svg>
                                            Delete
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>`
            );

        row.append(actionCell);
            $('#table-body').append(row);
        });
        $('#current-page').text(data.number + 1);
        $('#total-page').text(data.totalPages);
    }

    $('#prev-page').click(function(e) {
        e.preventDefault();
        if (currentPage > 0) {
            currentPage--;
            fetchData(currentPage);
        }
    });

    // Next page click event
    $('#next-page').click(function(e) {
        e.preventDefault();
        if (currentPage < totalPage - 1) {
            currentPage++;
            fetchData(currentPage);
        }
        
    });

    //===============EDIT========================================================================================================
    $(document).on('click', '.text-end', function() {
        var row = $(this).closest('tr');
        var idCell = row.find('td:eq(1)');
        var id = idCell.text().trim();
        console.log("Clicked Edit button for ID: " + id);

        $.ajax({
            url: 'http://localhost:8080/api/v1/register-certificates/'+ id,
            method: 'GET',
            success: function(data) {

                $('.edit-form input[name="username"]').val(data.name);
                $('.edit-form input[name="id"]').val(data.id);
                $('.edit-form input[name="email"]').val(data.email);
                $('.edit-form input[name="date"]').val(data.date_register);
                $('.edit-form input[name="phone"]').val(data.phone);
                $('.edit-form input[name="company"]').val(data.companyName);
                $('.edit-form select[name="change-status"]').val(data.status);
                $('.edit-form input[name="expried"]').val(data.expried);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });

        $('.edit-form').submit(function(event) {
            event.preventDefault();

            var url = 'http://localhost:8080/api/v1/register-certificates/'+id+'/update-status'
            var status = $(this).find('select[name="change-status"]').val();

            $.ajax({
                url: url + '?status=' + status,
                method: 'PUT',
                success: function(data) {
                    console.log('Status updated successfully');
                    showAlertSuccess();
                    $('#open_close').prop('disabled', true);
                    $('.modal-overlay').hide(); 
                    $('.modal-container').hide(); 
                    fetchData(currentPage);
                    
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    showAlertError();
                }
            });
        });

        $(document).on('click', '#btn-delete', function(){
            var url = 'http://localhost:8080/api/v1/register-certificates/'+id
            var status = $(this).find('select[name="change-status"]').val();

            $.ajax({
                url: url ,
                method: 'DELETE',
                success: function(data) {
                    console.log('Delete successfully');
                    showAlertSuccess();
                    
                    fetchData(currentPage);
                    
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    showAlertError();
                }
            });
        });
       
    });
    
    $(document).on('click', '#btn-edit', function(){
        $('.modal-overlay').show(); 
        $('.modal-container').show(); 
    });

    $(document).on('click', '.modal-overlay', function(){
        $('.modal-overlay').hide(); 
        $('.modal-container').hide(); 
    });

    $("#certificateId").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#data-table tr").filter(function() {
            var secondColumnText = $(this).find('td:eq(1)').text().toLowerCase();
            $(this).toggle(secondColumnText.indexOf(value) > -1);
        });
      });

      $("#name").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#data-table tr").filter(function() {
            var secondColumnText = $(this).find('td:eq(0)').text().toLowerCase();
            $(this).toggle(secondColumnText.indexOf(value) > -1);
        });
      });
      $("#email").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#data-table tr").filter(function() {
            var secondColumnText = $(this).find('td:eq(2)').text().toLowerCase();
            $(this).toggle(secondColumnText.indexOf(value) > -1);
        });
      });

    $('.menu-dropdown ul li a').click(function(event) {
        event.preventDefault(); 
        var status = $(this).data('status'); 
        $('#status-text').text(status); 


        var value = status.toLowerCase();
        if(status == 'All') {
            fetchData(0, 10); 
        }
        $("#data-table tr").each(function() {
            var secondColumnText = $(this).find('td:eq(5)').text().toLowerCase();
            $(this).toggle(secondColumnText.indexOf(value) > -1);
        });
    });
});
