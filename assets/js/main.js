var ID_USER = localStorage.getItem('env_id');

let isload = 0;
$(window).on('scroll  mousemove touchstart',function(){
	try{
		if(!isload){
			isload = 1

            $(document).ready(function(){
				var placeholderText = ['Bạn muốn tìm gì?','Trang điểm', 'Dưỡng thể', 'Chăm sóc cá nhân', 'Chăm sóc cơ thể'];
				$('.search-auto').placeholderTypewriter({text: placeholderText});
			});

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
        }
	}catch(e){
		console.log(e);
	}
});



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

		$('.open-modal-view').click(function(event) {
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
		
	});

	function addProductCart(data) {
        $.ajax({
            url: 'http://localhost:8080/api/v4/shoppingCart',
            type: 'POST',
            data: {
                idUser: ID_USER,
                idProd: data.idProd,
                price: 20000
            },
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }
    

