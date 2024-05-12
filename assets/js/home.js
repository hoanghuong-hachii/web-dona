var ID_USER = localStorage.getItem('env_id');
var env_Url = localStorage.getItem('env_url');
$(document).ready(function(){
 
    var env_Url = localStorage.getItem('env_url');
    fetchData();
    function fetchData() {
        $.ajax({
            url: env_Url+ '/api/v1/Products/roleUser/coupons',
            type: 'GET',
            success: function(response) {
                //console.log(response)
                updateUI(response)
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error('Error:', error);
            }

        })
    }

    function updateUI(products) {
        var productList = $('#discount-pro')
        productList.empty();
        for (var i = 0; i < Math.min(products.length, 5); i++) {
            var product = products[i];
            
            var productHtml = `
                <div class="col l-2-4 m-4 c-6 mt-8">
                    <a href="/product_detail.html?id=${product.idProd}">
                        <div class="product-body " id="${product.idProd}">

                            <div class="product-body__img">
                                <img src="${product.imageAvatar}" alt="${product.productName}" class="product-img">
                                <a href="#" class="product-like"><svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#000000" d="M31.91 61.67L29.62 60c-9.4-6.7-16.72-13.49-21.74-20.17C3.11 33.5.48 27.39.06 21.7A17.63 17.63 0 0 1 5.45 7.16a17 17 0 0 1 11.86-4.81c3.46 0 7.93.39 11.8 3.4A19.09 19.09 0 0 1 32 8.41a19.91 19.91 0 0 1 2.91-2.67c3.89-3 8.37-3.41 11.84-3.41a16.86 16.86 0 0 1 11.85 4.8 17.51 17.51 0 0 1 5.33 14.53c-.44 5.7-3.1 11.81-7.9 18.14C51 46.5 43.63 53.3 34.21 60zM8.51 10.38a13.31 13.31 0 0 0-4 11c.35 4.83 2.69 10.15 6.94 15.79 4.7 6.24 11.59 12.65 20.48 19 8.92-6.39 15.84-12.81 20.58-19.08 4.28-5.65 6.64-11 7-15.8a13.25 13.25 0 0 0-4-11 12.53 12.53 0 0 0-8.76-3.57c-2.76 0-6.29.29-9.11 2.48a12.37 12.37 0 0 0-3.09 3.15v.07L32 16l-2.5-3.56a12.68 12.68 0 0 0-3.11-3.2c-2.8-2.17-6.32-2.46-9.07-2.46a12.58 12.58 0 0 0-8.8 3.59z"></path></svg></i></a>
                                <img src="./assets/imgs/freeship_tag.webp" alt="" class="freeship_tag">

                                <a class="view_product btn_view-all open-modal-view">Xem nhanh</a>
                                <a class="add_cart btn_view-all open-modal-cart">Thêm vào giỏ</a>
                            </div>
                            <div class="product-body-content">
                                <h3 class="product-band">${product.brand}</h3>
                                <h3 class="product-name">${product.productName}</h3>
                                <div class="product-price">
                                    <span class="product-price__new">${product.formattedDiscountedPrice}đ</span>
                                    <span class="product-price__old">${product.formattedPrice}đ</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            productList.append(productHtml);
        }
    }
    


    


    $(document).on('click', '.open-modal-view', function(event){
        $('.modal-overlay').show()
        $('.modal-container').show()
        var thisPro = $(this).closest('.product-body')
        console.log(thisPro.attr('id'))
        event.stopPropagation(); 
    });
    $(document).on('click', '.open-modal-cart', function(event){
        $('.modal-overlay').show()
        $('.modal-addCart').show()
        var thisPro = $(this).closest('.product-body')
        var idProduct = thisPro.attr('id')
        addProductCart({
            idProd: idProduct
        })
        event.stopPropagation();
    });


    
    

   // $(document).on('click', '.product-body:not(.open-modal-view):not(.open-modal-cart)', function(){
     //   console.log('view details');
    //    window.location.href = './product_detail.html';
    //});
    
})


//==============\
$(document).ready(function() {
    var startDate = new Date('2024-05-13T00:00:00').getTime();
    var endDate = new Date('2024-06-21T00:00:00').getTime();

    var x = setInterval(function() {
        var now = new Date().getTime();
        var distanceStart = startDate - now;
        var distanceEnd = endDate - now;

        var days = Math.floor(distanceStart / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distanceStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distanceStart % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distanceStart % (1000 * 60)) / 1000);

        $("#day").text(days);
        $("#hour").text(hours);
        $("#minute").text(minutes);
        $("#second").text(seconds);

        if (distanceEnd < 0) {
            clearInterval(x);
            $("#day").text("Hết thời gian khuyến mãi");
            $("#hour").text("");
            $("#minute").text("");
            $("#second").text("");
        }
    }, 1000);
});

