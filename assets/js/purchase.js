var env_Url = localStorage.getItem('env_url');
function getCurrentDateTime() {
    var currentDate = new Date();

    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;

    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; 
    var year = currentDate.getFullYear();

    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;

    var formattedDateTime = hours + ':' + minutes + ':' + seconds + ' ' + day + '/' + month + '/' + year;

    return formattedDateTime;
}

$(document).ready(function() {

    var ID_USER = localStorage.getItem('env_id');
    loadCart();

    $.ajax({
        url: env_Url + '/api/v2/users/id?idUser='+ ID_USER,
        type: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'true'
        },
        success: function(response) {
            //console.log(response);
            updateData(response);
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    })

    function updateData(data) {
        $('#email').val(data.email)
        $('#name').val(data.userName)
        $('#sdt').val(data.phoneNumber)
        $('#dc').val(data.address)

    }

    function loadCart(){
        var id = localStorage.getItem('env_id');
        var cart = $('#productList')
        cart.empty()
        $.ajax({
            url: env_Url +'/api/v4/shoppingCart/user/' +id,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(respone) {
                getProduct(respone)
            },
            error: function(xhr, status, error) {
                console.log(error)
            }
        })
        var quantity=0;
        function getProduct(data) {
            
            data.forEach(function(product) {
                var id = product.idProd
                quantity = product.quantityProd
    
                $.ajax({
                    url: env_Url + '/api/v1/Products/roleUser/' + id,
                    type: 'GET',
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    },
                    success: function(respone,quantity){
                         
                        updateLayout(respone)
    
                    },
                    error: function(xhr, status, error) {
                        console.log(error)
                    }
                })
            });
        }

        function updateLayout(data) {
            
            var productHtml = `
                <li  class="item proItem">
                    <div class="info">
                        <img  src="${data.imageAvatar}" alt="">
                        
                    </div>
                    <div class="name">
                        <div>${data.productName}</div>
                        <div class="quantity_price">
                            x<div class="quantity">${quantity}</div>
                            <div id="price-item-total" class="price">${data.formattedDiscountedPrice}đ</div>
                        </div>
                        
                    </div>
                    

                </li>
            `;
            cart.append(productHtml);

            var totalPrice = 0;
            $('.proItem').each(function() {
                var quan = parseInt($(this).find('.quantity').text())
                var total = parseInt(data.formattedDiscountedPrice.replace('đ', '').replace('.', ''));
                //console.log(total)
                var priceitem = quan * total
                //console.log(priceitem)

                var formattedTotal = priceitem.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                
                $(this).find('#price-item-total').text(formattedTotal+'đ'); 
                
                totalPrice += priceitem; 
                //console.log(totalPrice)
            });

            var payment = totalPrice + 40000
            var formattedTotal = payment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            
            $('.tongcong').text(formattedTotal)

            var formattedTotal = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            
            $('.tongtam').text(formattedTotal)

        }

        
    }

    var transaction = 0;
    var ID_USER = localStorage.getItem('env_id');
    $('#dathang').click( function(){
        //kiem tra phuong thuc thanh toan
        var isChecked = $('#ck').is(':checked');
        if (isChecked) {
            transaction = 1;
            console.log('ck')
        } else {
            transaction = 0;
            console.log('cod')
        }
        //
        if(transaction == 0){
            postBill()
        }
        else {
            //thanh toan online
            thanhtoanOnline();

        }
        //showSuccessToast()
    })

    function thanhtoanOnline() {
        var amount = 200000;
        var orderInfo = 'test';
        
        $.ajax({
            url: env_Url +'/api/v9/pay/submitOrder',
            type: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            dataType: 'text', 
            data: {
                amount: amount,
                orderInfo: orderInfo
            },
            success: function(response) {
                console.log(response)
                var parts = response.split('redirect:');
                var redirectUrl = parts[1].trim(); 
                console.log(redirectUrl)
                window.location.href = redirectUrl; 
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Lỗi: ', textStatus, errorThrown);
            }
        });
    }

    function postBill() {
        showSuccessToast({msg: 'Đặt hàng thành công'})

        $.ajax({
            url: env_Url +'/api/v4/shoppingCart/user/'+ID_USER,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(cartData) {
                var productBillDTOS = cartData.map(function(item) {
                    return {
                        "quantity": item.quantityProd,
                        "retailPrice": item.price,
                        "unitName": "cai", 
                        "totalPriceProd": item.totalPrice,
                        "productId": item.idProd,
                        "productName": "Unknown", 
                        "discount": 0 
                    };
                });
    
                console.log('productBillDTOS:', productBillDTOS);
    
                sendProductBillDTOS(productBillDTOS);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching shopping cart data:', error);
            }
        });
    }
    
    function sendProductBillDTOS(productBillDTOS) {
        var jsonData = {
            "idUser": ID_USER,
            "userName": $('#name').val(),
            "numberPhoneCustomer": $('#sdt').val(),
            "addressCustomer": $('#dc').val(),
            "dateTimeOrder": getCurrentDateTime(),
            "status": "Pending",
            "totalPayment": 0, 
            "payableAmount": 0,
            "shippingFee": 40000,
            "note": "string",
            "productBillDTOS": productBillDTOS
        }

        $.ajax({
            url: env_Url + '/api/v5/Bill/bills',
            type: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            success: function(response) {
                console.log('Successfully sent productBillDTOS:', response);
                
                showSuccessToast({msg: 'Đặt hàng thành công'})
            },
            error: function(xhr, status, error) {
                console.log('Error sending productBillDTOS:', error);
            }
        });
    }

    
    $(document).on('change', 'input[name="tran"]', function(){
        if($(this).is(':checked')) {
            var selectedId = $(this).attr('id');
            switch(selectedId) {
                case 'cod':
                    console.log('Cod')
                    transaction = 0;
                    break;
                case 'ck':
                    console.log('online')
                    transaction = 1;
                    break;
            }
        }
    });
    

})




