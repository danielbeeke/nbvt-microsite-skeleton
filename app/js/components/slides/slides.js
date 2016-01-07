$(function() {

    $(document).ready(function () {
        slidesController.init()
    });

    var slidesController = {
        init: function () {
            var debounceTimeout;
            console.log('test 2');
            $(window).on('resize', function () {
                clearTimeout(debounceTimeout);

                debounceTimeout = setTimeout(function () {
                    slidesController.handleContext()
                }, 300);
            });

            slidesController.handleContext()
        },
        handleContext: function () {
            if ($(window).width() > 1280) {
                console.log('desktop')
                slidesController.sliders.main.desktop()
                slidesController.sliders.sub.desktop()
            }
            else {
                console.log('mobile')
                slidesController.sliders.main.mobile()
                slidesController.sliders.sub.mobile()
            }
        },
        sliders: {
            main: {
                desktop: function () {
                    var settings = {
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        singleItem: true
                    };

                    if ($('#slides').data('owlCarousel')) {
                        $('#slides').data('owlCarousel').destroy().owlCarousel(settings);
                    }

                    $('#slides').owlCarousel(settings);
                },
                mobile: function () {
                    var settings = {
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        autoHeight: true,
                        singleItem: true
                    };

                    console.log('test 4');

                    if ($('#slides').data('owlCarousel')) {
                        $('#slides').data('owlCarousel').destroy().owlCarousel(settings);
                    }

                    $('#slides').owlCarousel(settings);
                }
            },
            sub: {
                desktop: function () {

                    console.log('test 5');

                    $('.slide-item-details').owlCarousel({
                        transitionStyle:"fade",
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
                },
                mobile: function () {
                    if ($('.slide-item-details').data('owlCarousel')) {
                        $('.slide-item-details').data('owlCarousel').destroy()
                    }
                }
            }
        }
    };

    $('.details-tab').on('click', function () {
        var parentSliderId = $(this).parent().data('for')
        $('#' + parentSliderId).data('owlCarousel').goTo($(this).index());
    })
});

