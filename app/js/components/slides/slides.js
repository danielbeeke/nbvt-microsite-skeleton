$(function() {


    $('#slides').owlCarousel({
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem: true
    });


    $('.slide-item-details').owlCarousel({
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem: true,
        afterAction: function () {
            var tabs = this.$elem.parent().find('.details-tabs');
            var currentTab = tabs.find('.details-tab:nth-child(' + (this.currentItem + 1) + ')');
            tabs.find('.details-tab').removeClass('active');
            currentTab.addClass('active');
        }
    });


    $('.details-tab').on('click', function () {
        var parentSliderId = $(this).parent().data('for')
        $('#' + parentSliderId).data('owlCarousel').goTo($(this).index());
    })

});

