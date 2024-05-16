$('.btn-continue').click(function() {
    $('.modal-overlay').hide()
    $('.modal-addCart').hide()
    $('.movie-container').hide()
    $('.modal-container').hide()
})

$('.btn-view-cart').click(function() {
    window.location.href= 'shoping_cart.html'
})

function setNumLike() {
    var num = localStorage.getItem('num-like')
    $('#count-like').text(num)
}

function setNumCart() {
    var num = localStorage.getItem('num-cart')
    $('#count-cart').text(num)
}

