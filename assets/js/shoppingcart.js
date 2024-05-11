var ID_USER = localStorage.getItem('env_id');
var isInvoice = false;
$(document).ready(function() {

    loadCart();
    function loadCart(){
        var id = localStorage.getItem('env_id');
        var cart = $('#product-cart')
        cart.empty()
        $.ajax({
            url: 'http://localhost:8080/api/v4/shoppingCart/user/' +id,
            type: 'GET',
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
                    url: 'http://localhost:8080/api/v1/Products/roleUser/' + id,
                    type: 'GET',
                    success: function(respone,quantity){
                        if(respone != null) {
                            $('.emptycart').hide()
                            $('.container-body').show()
                            updateLayout(respone)
    
                        } else {
                            $('.emptycart').show()
                            $('.container-body').hide()
                        }
                    },
                    error: function(xhr, status, error) {
                        console.log(error)
                    }
                })
            });
        }

        function updateLayout(data) {
            console.log(quantity)
            var productHtml = `
                <li id="${data.idProd}" class="item " >
                    <div class="info">
                        <img  src="${data.imageAvatar}" alt="">
                        <div class="name">
                            <div>${data.productName}</div>
                            <a href="#" class="delete">Xóa</a>
                        </div>
                    </div>
                    <div id="price1" class="price">${data.formattedDiscountedPrice}đ</div>
                    <div class="quantity">
                        <a class="btn-product" href="#" id="btn-min">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
                                <path fill="none" stroke="#313131" stroke-linecap="round" stroke-linejoin="round" d="M5.5 10.5h10" />
                            </svg>
                        </a>
                        <input type="text" class="count-num" value="${quantity}">
                        <a class="btn-product" id="btn_plus" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
                                <path fill="none" stroke="#313131" stroke-linecap="round" stroke-linejoin="round" d="M5.5 10.5h10m-5-5v10" />
                            </svg>
                        </a>
                    </div>

                    <div id="price-item-total" class="price totalItem">${data.formattedDiscountedPrice}đ</div>

                </li>
            `;
            cart.append(productHtml);

            total1()

        }
    }
    

    
    
    $(document).on('click', '#btn-min', function() {
        var parent = $(this).closest('.quantity')
        var parentItem = $(this).closest('.item')

        var pricePerItem = parentItem.find('#price1').text();
        //console.log(pricePerItem)
        var number = parseInt(pricePerItem.replace(".", ""));
        //console.log(number)
        var cnt = parent.find('.count-num').val(); 
        if (cnt > 1) {
            cnt--;
            parent.find('.count-num').val(cnt);
            var total = cnt* number
            var formattedTotal = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            parentItem.find('#price-item-total').text(formattedTotal+'đ')
            total1()
            var itemId = parentItem.attr('id');
            updateShopCart({ idProd: itemId, quantity1: cnt})

        }

    });
    
    $(document).on('input', '.count-num',function() {
        var parentItem = $(this).closest('.item')
        var pricePerItem = parentItem.find('#price1').text();
        var number = parseInt(pricePerItem.replace(".", ""));
        var cnt = $(this).val(); 
        var total = cnt * number
        var formattedTotal = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        parentItem.find('#price-item-total').text(formattedTotal+'đ')
        total1()
        var itemId = parentItem.attr('id');
        updateShopCart({ idProd: itemId, quantity1: cnt})

    });
    
    $(document).on('click', '#btn_plus',function() {
        var parent = $(this).closest('.quantity')
        var parentItem = $(this).closest('.item')
        var pricePerItem = parentItem.find('#price1').text();
       // console.log(pricePerItem)
        var number = parseInt(pricePerItem.replace(".", ""));
        var cnt = parent.find('.count-num').val(); 
        cnt++;
        parent.find('.count-num').val(cnt); 
        var total = cnt* number
        var formattedTotal = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        parentItem.find('#price-item-total').text(formattedTotal+'đ')
        total1()
        var itemId = parentItem.attr('id');
        updateShopCart({ idProd: itemId, quantity1: cnt})
    });


    $(document).on('click', '.delete',function() {
        console.log('delete')
        var parentItem = $(this).closest('.item')
        var itemId = parentItem.attr('id');
        deleteProductCart({idProd: itemId});
       
        loadCart()
    });

    function total1(){
        var totalPrice = 0;

        $('.totalItem').each(function() {
            var formattedTotal = $(this).text(); 
            var total = parseInt(formattedTotal.replace('đ', '').replace('.', ''));
            //console.log(total)

            totalPrice += total; 
        });
        var formattedTotal = totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        console.log('Total Price:', formattedTotal);
        $('#total-price').text(formattedTotal)
    }

    $(document).on('change', '#check_invoice', function(){

        if($('#check_invoice').is(':checked')) {
            console.log('lap hoa don')
        }
        else {
            console.log('khong lap hoa dơn')
        }
    })
})


function updateShopCart(data) {
    var idUser = localStorage.getItem('env_id');
    $.ajax({
        url: 'http://localhost:8080/api/v4/shoppingCart',
        type: 'PUT', 
        data: {
            idUser: idUser,
            idProd: data.idProd,
            quantityProd: data.quantity1,
            price: 20000
        },
        success: function(respone){
            //console.log(respone)
        },
        error: function(xhr,status, error) {
            console.log(error)
        }
    })
}

function deleteProductCart(data) {
    $.ajax({
        url: 'http://localhost:8080/api/v4/shoppingCart',
        type: 'DELETE',
        data: {
            idUser: ID_USER,
            idProd: data.idProd
        },
        success: function(response) {
            isInvoice = true;
            console.log(response);
        },
        error: function(xhr, status, error) {
            isInvoice = false;
            console.log(error);
        }
    });
}

