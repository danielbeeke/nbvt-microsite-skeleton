$(function() {

    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= $('.member-filters-wrapper').height()) {
            $('body').addClass('has-visible-filter-back-button')
        }
        else {
            $('body').removeClass('has-visible-filter-back-button')
        }
    })

    $('.back-to-filter-button').on('click', function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500)
        return false
    })

});
