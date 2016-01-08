$(function() {

    $(document).ready(function () {
        slidesController.init()
    });

    var slidesController = {
        init: function () {
            var debounceTimeout;

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
                slidesController.sliders.main.destroy();
                slidesController.sliders.sub.destroy();

                slidesController.sliders.main.desktop();
                slidesController.sliders.sub.desktop();
            }
            else {
                slidesController.sliders.main.destroy();
                slidesController.sliders.sub.destroy();

                slidesController.sliders.main.mobile();
            }
        },
        sliders: {
            main: {
                desktop: function () {
                    var settings = {
                        slideSpeed: 300,
                        paginationSpeed: 400,
                        singleItem: true,
                        navigation: true
                    };

                    $('#slides').owlCarousel(settings);
                },
                mobile: function () {
                    var settings = {
                        slideSpeed: 300,
                        paginationSpeed: 400,
                        autoHeight: true,
                        singleItem: true,
                        navigation: true
                    };

                    $('#slides').owlCarousel(settings);
                },
                destroy: function () {
                    if ($('#slides.owl-theme').length) {
                        $('#slides.owl-theme').data('owlCarousel').destroy();
                    }
                }
            },
            sub: {
                desktop: function () {
                    $('.slide-item-details').owlCarousel({
                        transitionStyle:"fade",
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        singleItem: true,
                        autoHeight: true,
                        afterAction: function () {
                            var tabs = this.$elem.parent().find('.details-tabs');
                            var currentTab = tabs.find('.details-tab:nth-child(' + (this.currentItem + 1) + ')');
                            tabs.find('.details-tab').removeClass('active');
                            currentTab.addClass('active');
                        }
                    });
                },
                destroy: function () {
                    if ($('.slide-item-details.owl-theme').length) {
                        $('.slide-item-details.owl-theme').each(function () {
                            $(this).data('owlCarousel').destroy()
                        })
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

