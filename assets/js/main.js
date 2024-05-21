var ID_USER = localStorage.getItem('env_id');
var env_Url = localStorage.getItem('env_url');
let isload = 0;


	$(document).ready(function() {
		$('#control-menu__left').click(function(){
			console.log('click left')
			$(".nav-category").animate({scrollLeft: "-=100px"});
		});
		
		$('#control-menu__right').click(function(){
			$(".nav-category").animate({scrollLeft: "+=100px"});
		});
	
		$('.left').click(function(){
			console.log('click left')
			$(".nav-category").animate({scrollLeft: "-=100px"});
		});
		
		$('.right').click(function(){
			$(".nav-category").animate({scrollLeft: "+=100px"});
		});

	})




	let sliderIndex = 1;
	showSlider(sliderIndex);

	function plusSlide(n) {
		showSlider(sliderIndex += n);
	}

	function showSlider(n){
		let i;
		let slides = document.getElementsByClassName('mySlides');

		if (n > slides.length) {sliderIndex = 1}
		if (n < 1) {sliderIndex = slides.length}

		for(i = 0; i < slides.length; i++){
			slides[i].style.display ="none";
		}

		slides[sliderIndex - 1].style.display = "block";
		
	}

	setInterval(function() {
		plusSlide(1);
	}, 5000);

	
//===========THông báo=============
	function AlertProcess({
		icon="",
		title="",
		message="",
		type="success"
	}){
		let showToast = $(".toastSuccess")
		showToast.addClass('show')
		$(".toast-btn__cancel").on('click', function(){
			showToast.removeClass('show')
		})

		$(".toast-btn__ok").on('click', function(){
			showToast.removeClass('show')
		})

		$(".toast-header").addClass(`toast--${type}`)
		$(".toast-icon").addClass(`${icon} toast--${type}`)
		$(".toast-status").text(title)
		$(".toast-desc").text(message)
		$(".toast-btn__ok").addClass(`toast--${type}`)
	}
	function showAlertSuccess(data){
		AlertProcess({
			icon:"fa-regular fa-circle-check",
			title:"Success",
			message: data.message,
			type:"success"
		})
	}
	function showAlertError(data){
		console.log('thahnh cong')
		AlertProcess({
			icon:"fa-solid fa-triangle-exclamation",
			title:"Error",
			message:data,
			type:"error"
		})
	}
	

	
	function infoPro(idProd){
		console.log('idProd main')
		$.ajax({
			url: env_Url + '/api/v1/Products/roleUser/' + idProd,
			type: 'GET',
			headers: {
				'ngrok-skip-browser-warning': 'true'
			}, 
			success: function(respone){
				console.log(respone)
				$('.view-proName').text(respone.productName)
				$('.view-price__current').text(respone.formattedDiscountedPrice)
				$('.view-price__old').text(respone.formattedPrice) 
				$('.view-desc').text(respone.detail) 
				$('.view-main-img').attr('src', respone.imageAvatar);

				fetchLayoutChild(idProd)

			},
			error: function(xhr, status, error){
				console.log(error)
			}
		})


	}

	
    function fetchLayoutChild(id) {
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
                    <a class="view-child-img" id="child-imgPro" href="#">
                        <img src="${image.imageUrl}" alt="${image.imageName}">
                    </a>
                </li>
            `;
            imageList.append(imgChildHtml);
        });
    }
    
	$(document).ready(function(){
		$('.icon-down').show()
		$('.menu-item').click(function(){
			
			$(this).find('.submenu-item').slideToggle("slow")
		});

		$('.open-modal-view').click(function(event) {
			console.log('xem nhanh main')
			var thisPro = $(this).closest('.product-body')
			var idProduct = thisPro.attr('id')
			console.log(idProduct)
			$('.modal-overlay').show()
			$('.modal-container').show()
			
			event.stopPropagation();
		})
		
		$('.open-modal-cart').click(function(event) {
			$('.modal-overlay').show()
			$('.modal-addCart').show()
			
			event.stopPropagation();
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
		$('.product-body:not(.open-modal-view):not(.open-modal-cart)').click(function() {
			console.log('view details');
			window.location.href = './product_detail.html';
		});

		$(document).on('click', '.product-like', function(event){
			var thisPro = $(this).closest('.product-body')
        	console.log(thisPro.attr('id'))
			var idPro = thisPro.attr('id');
			addProductLike(idPro)
			event.preventDefault(); 
        	event.stopPropagation(); 
		});
		function addProductLike(data) {

			$.ajax({
				url: env_Url+ '/api/v6/ProdLike',
				type: 'POST',
				data: {
					idUser: ID_USER,
					idProd: data
				},
				success: function(response) {
					console.log('yeu thích'+response);
					getProLike()
				},
				error: function(xhr, status, error) {
					console.log(error);
				}
			});
		}
	
		function getProLike() {
			$.ajax({
				url: env_Url + '/api/v6/ProdLike/user/' + env_ID,
				type: 'GET',
				headers: {
					'ngrok-skip-browser-warning': 'true'
				},
				success: function(response) {
					console.log('Độ dài của mảng: ' + response.length);
					localStorage.setItem('num-like', response.length)
					var num = response.length;
					$('#count-like').text(num)
	
				},
				error: function(xhr, status, error) {
					console.log(error)
				}
			
			})
		}
		
	});

	

	function addProductCart(data) {

        $.ajax({
            url: env_Url+ '/api/v4/shoppingCart',
            type: 'POST',
            data: {
                idUser: ID_USER,
                idProd: data.idProd,
                price: 20000
            },
            success: function(response) {
                //console.log(response);
				getProCart()
				infoPro(data.idProd)

            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

	function getProCart() {
		$.ajax({
			url: env_Url +'/api/v4/shoppingCart/user/' + ID_USER,
			type: 'GET',
			headers: {
				'ngrok-skip-browser-warning': 'true'
			},
			success: function(respone) {
				localStorage.setItem('num-cart', respone.length)
				setNumCart()
			},
			error: function(xhr, status, error) {
				console.log(error)
			}
		})
	}
    

	function ProductLike() {
        $('.product-body').each(function(event){
            var thisPro = $(this);
            var idPro = thisPro.attr('id');
            //console.log($(this))
            if(idPro){
                checkProductLike(idPro, thisPro);
            }
        });
    }

	function productDetailLike(idPro){
		var thisPro = $('.btn-heart')
		console.log('btn-heart detail')
		if(idPro){
			checkProductLike(idPro, thisPro);
		}
	}

    function checkProductLike(idPro, productElement){
        $.ajax({
            url: env_Url+ '/api/v6/ProdLike/check?idUser='+ ID_USER + '&idProd='+ idPro,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(response) {
                //console.log('checklike: '+ response)
                if(response == true) {
                    productElement.find('.not-like').hide();
                    productElement.find('.like-item').show();
                }
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error('Error:', error);
            }
        })
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

        event.preventDefault(); 
        event.stopPropagation(); 
    });


    function addProductLike(productId, productElement) {
        $.ajax({
            url: env_Url + '/api/v6/ProdLike',
            type: 'POST',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            data: {
                idUser: ID_USER,
                idProd: productId
            },
            success: function(response) {
                //console.log('Yêu thích: ' + response);
                productElement.find('.not-like').hide();
                productElement.find('.like-item').show();
                getProLike(); // Cập nhật số lượng likes
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

    function removeProductLike(productId, productElement) {
        $.ajax({
            url: env_Url + '/api/v6/ProdLike',
            type: 'DELETE',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            data: {
                idUser: ID_USER,
                idProd: productId
            },
            success: function(response) {
                //console.log('Bỏ yêu thích: ' + response);
                productElement.find('.not-like').show();
                productElement.find('.like-item').hide();
                getProLike(); 
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

    function getProLike() {
        $.ajax({
            url: env_Url + '/api/v6/ProdLike/user/' + ID_USER,
            type: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            },
            success: function(response) {
                //console.log('Độ dài của mảng: ' + response.length);
                localStorage.setItem('num-like', response.length);
                var num = response.length;
                $('#count-like').text(num);
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }