$(function() {
    $('.mobile-menu-toggle').on('click', function () {
        $('body').toggleClass('has-mobile-menu-expanded');
        return false;
    });
});
