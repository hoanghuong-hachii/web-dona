var env_Url = localStorage.getItem('env_url');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
console.log('ID sản phẩm:', id);

$(document).ready(function() {
    $('#control-menu__left').click(function(){
        console.log('click left')
        $(".nav-category").animate({scrollLeft: "-=100px"});
    });
    
    $('#control-menu__right').click(function(){
        $(".nav-category").animate({scrollLeft: "+=100px"});
    });


    $('.btn-left').click(function(){
        console.log('click left')
        $(".child-img").animate({scrollLeft: "-=100px"});
    });
    
    $('.btn-right').click(function(){
        $(".child-img").animate({scrollLeft: "+=100px"});
    });
    $('.default').click(function(event){
        event.preventDefault();
    });

    $('a[href="#"]').click(function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 
    });
    

})

$(document).ready(function(){
    $('.icon-down').show()
    $('.menu-item').click(function(){
        // $('.menu-item').not(this).find('.submenu-item').removeClass('active');
        // $('.menu-item').not(this).find('.icon-down').show()
        // $('.menu-item').not(this).find('.icon-up').hide()
        // $(this).find('.submenu-item').toggleClass('active');
        // $(this).find('.icon-up').show()
        // $(this).find('.icon-down').hide()
        $(this).find('.submenu-item').slideToggle("slow")
    });

    $('.open-modal-view').click(function() {

        console.log('xem nhanh pro detail')
        var thisPro = $(this).closest('.product-body')
        var idProduct = thisPro.attr('id')
        console.log(idProduct)
        $('.modal-overlay').show()
        $('.modal-container').show()
    })

    $('.open-modal-cart').click(function() {
        $('.modal-overlay').show()
        $('.modal-addCart').show()
    })

    $('.open-movie').click(function() {
        $('.modal-overlay').show()
        $('.movie-container').show()
    })

    $('.header-menu').click(function() {
        $('.modal-overlay').show()
        $('.navbar-menu').show().css('transform', 'translateX(0)')
    })

    $('.modal-overlay').click(function() {
        $('.modal-overlay').hide()
        $('.navbar-menu').css('transform', 'translateX(-100%)')
        $('.modal-addCart').hide()
        $('.movie-container').hide()
        $('.modal-container').hide()
    })

    $('.modal-close').click(function() {
        $('.modal-overlay').hide()
        $('.navbar-menu').css('transform', 'translateX(-100%)')
        $('.modal-addCart').hide()
        $('.modal-container').hide()
        $('.movie-container').hide()

    })

    $('.menu-close').click(function() {
        $('.modal-overlay').hide()
        $('.navbar-menu').css('transform', 'translateX(-100%)')
    })

    $('.nav-list .item').click(function() {
        $('.nav-list .item').not(this).find('a').css({
            "color":'var(--text-color)',
            "border-bottom": 'none'
        })
        $(this).find('a').css({
            "color":'var(--subColor)',
            "border-bottom": 'solid 2px var(--subColor)'
        })
    })

    $('.btn_addcart').click(function() {

        var cnt = $('.count-num').val()
        console.log('SO LUONG: '+ cnt)
        showSuccessToast({msg: 'Thêm vào giỏ thành công'})
        addProductCart({
            idProd: id
        })

        if(cnt > 1){
            updateShopCart({ idProd: id, quantity1: cnt})
        }

        
    })

    function updateShopCart(data) {
        console.log('add '+ data.idProd +" " + data.quantity1,)
        var idUser = localStorage.getItem('env_id');
        $.ajax({
            url: env_Url +'/api/v4/shoppingCart',
            type: 'PUT', 
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            data: {
                idUser: idUser,
                idProd: data.idProd,
                quantityProd: data.quantity1,
                price: 20000
            },
            success: function(respone){
                console.log(respone)
            },
            error: function(xhr,status, error) {
                console.log(error)
            }
        })
    }

    $('.like-icon').click( function(event){
        var thisIcon = $(this);
        var thisPro = $('.btn-heart')
		console.log('click like')
        if(thisIcon.hasClass('like-item')) {
            removeProductLike(id, thisPro);
        } else {
            addProductLike(id, thisPro);
        }

        event.preventDefault(); 
        event.stopPropagation(); 
    });



});




$(document).ready(function(){

    fetchData();
    function fetchData() {
        $.ajax({
            url: env_Url + '/api/v1/Products/roleUser/'+ id,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(response) {
                //console.log(response)
                updateUI(response)
            },
            error: function(xhr, status, error) {
                // Handle error
                console.log('Error:', error);
            }

        })
    }

    function updateUI(products) {
        
        var product = products;
        $('#image-main1').attr('src', product.imageAvatar).attr('alt', product.imageName);
        if(product.coupons == 0) {
            $('.freeship-tag').hide()
            $('.discount-percent').hide()

        }
        $('#productDetail-title').text(product.productName)
        $('.price-cur').text(product.formattedDiscountedPrice + 'đ')
        $('.price-old').text(product.formattedPrice+ 'đ')
        $('.band').text(product.brand)
        $('.discount-percent').text('Giảm '+product.coupons+'%')

        productDetailLike(id)

        fetchLayoutChild()
    }

   

    function fetchLayoutChild() {
        $.ajax({
            url: env_Url + '/api/v1/product-images/'+id,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(response){
                console.log(response)
                updateLayoutChild(response)
            },
            error: function(xhr,status, error) {
                console.log(error)
            }
        })

    }

    function updateLayoutChild(images) {
        var imageList = $('#imgchild-productDetail')
        imageList.empty()
        images.forEach(function(image) {
            var imgChildHtml = `
                <li class="chils-img__item">
                    <a id="child-imgPro" href="#">
                        <img src="${image.imageUrl}" alt="${image.imageName}">
                    </a>
                </li>
            `;
            imageList.append(imgChildHtml);
        });
    }
    $(document).on('click', '#child-imgPro', function(event){
        var imageUrl = $(this).find('img').attr('src');
        //console.log('Image URL:', imageUrl);
        $('#image-main1').attr('src', imageUrl).attr('alt', 'image-product');

    })
     

    $(document).on('click', '.open-modal-view', function(event){
        $('.modal-overlay').show()
        $('.modal-container').show()
        event.stopPropagation(); 
    });
    $(document).on('click', 'a[href="#"]', function(event) {
        console.log('ok')
        event.preventDefault(); 
        event.stopPropagation(); 
    })

    $('#btn-min').click(function() {
        console.log('min')
        var cnt = $('.count-num').val(); 
        var number = $('.input-number').val()
        
        if (cnt > 1 || number >1) {
            cnt--;
            $('.count-num').val(cnt); 

            number--;
            $('.input-number').val(number)
        }
    });
    
    $('#btn_plus').click(function() {
        console.log('add')

        var cnt = $('.count-num').val(); 
        cnt++;
        $('.count-num').val(cnt); 

       
    });
    $('#btn-plus').click(function() {
        console.log('add')

        var cnt = $('.count-num').val(); 
        cnt++;
        $('.count-num').val(cnt); 
        var number = $('.input-number').val()
        number++;
        $('.input-number').val(number)
    });
    


    
})

