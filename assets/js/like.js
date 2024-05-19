var ID_USER = localStorage.getItem('env_id');
var env_Url = localStorage.getItem('env_url');

$(document).ready(function() {

    fetchData();

    function fetchData() {

        console.log('re send')
        const cacheBuster = new Date().getTime();
        $.ajax({
            url: `${env_Url}/api/v6/ProdLike/user/${ID_USER}?cb=${cacheBuster}`,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(response) {

                console.log(response)
                updateUI(response);
                
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function updateUI(products) {
        var productList = $('#pro_hot');
        productList.empty();
        products.forEach(productContent => {

            var product = productContent.product;

            var productHtml = `
                <div class="col l-3 m-4 c-6 mt-8">
                    <a href="/product_detail.html?id=${product.idProd}">
                        <div class="product-body" id="${product.idProd}">
                            <div class="product-body__img">
                                <img src="${product.imageAvatar}" alt="${product.productName}" class="product-img">
                                <a href="#" class="product-like">
                                <svg class="like-icon not-like" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#000000" d="M31.91 61.67L29.62 60c-9.4-6.7-16.72-13.49-21.74-20.17C3.11 33.5.48 27.39.06 21.7A17.63 17.63 0 0 1 5.45 7.16a17 17 0 0 1 11.86-4.81c3.46 0 7.93.39 11.8 3.4A19.09 19.09 0 0 1 32 8.41a19.91 19.91 0 0 1 2.91-2.67c3.89-3 8.37-3.41 11.84-3.41a16.86 16.86 0 0 1 11.85 4.8 17.51 17.51 0 0 1 5.33 14.53c-.44 5.7-3.1 11.81-7.9 18.14C51 46.5 43.63 53.3 34.21 60zM8.51 10.38a13.31 13.31 0 0 0-4 11c.35 4.83 2.69 10.15 6.94 15.79 4.7 6.24 11.59 12.65 20.48 19 8.92-6.39 15.84-12.81 20.58-19.08 4.28-5.65 6.64-11 7-15.8a13.25 13.25 0 0 0-4-11 12.53 12.53 0 0 0-8.76-3.57c-2.76 0-6.29.29-9.11 2.48a12.37 12.37 0 0 0-3.09 3.15v.07L32 16l-2.5-3.56a12.68 12.68 0 0 0-3.11-3.2c-2.8-2.17-6.32-2.46-9.07-2.46a12.58 12.58 0 0 0-8.8 3.59z"></path></svg>
                                <svg style="display: none;" class="like-icon like-item" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16">
                                    <path fill="#ff0000" fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15C-7.534 4.736 3.562-3.248 8 1.314" />
                                </svg>
                                </a>
                                <img src="../assets/imgs/freeship_tag.webp" alt="" class="freeship_tag">
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
            
        });

        ProductLike()
    }

    
    $(document).on('click', '.like-icon', function(event){
        var thisIcon = $(this);
        var thisPro = thisIcon.closest('.product-body');
        var idPro = thisPro.attr('id');
		console.log('click like')
        if(thisIcon.hasClass('like-item')) {
            removeProductLike(idPro, thisPro);
        } else {
            addProductLike(idPro, thisPro);
        }

        fetchData();

        event.preventDefault(); 
        event.stopPropagation(); 
    });

    $(document).on('click', '.open-modal-view', function(event){
        $('.modal-overlay').show()
        $('.modal-container').show()
        var thisPro = $(this).closest('.product-body')
        //console.log(thisPro.attr('id'))
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

  
});



