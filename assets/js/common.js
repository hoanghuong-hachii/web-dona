$('.btn-continue').click(function() {
    $('.modal-overlay').hide()
    $('.modal-addCart').hide()
    $('.movie-container').hide()
    $('.modal-container').hide()
})

$('.btn-view-cart').click(function() {
    window.location.href= 'shoping_cart.html'
})