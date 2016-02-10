$(function() {

    $(document).ready(function () {
        slidesController.init()

        $('.details-tab').on('click', function () {
            var parentSliderId = $(this).parent().data('for');

            $('#' + parentSliderId).data('owlCarousel').jumpTo($(this).index());
        })
    });

    var slidesController = {
        init: function () {
            var debounceTimeout;

            if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $(window).on('resize', function () {
                    clearTimeout(debounceTimeout);

                    debounceTimeout = setTimeout(function () {
                        slidesController.handleContext()
                    }, 300);
                });
            }
            else {
                slidesController.handleContext()
            }

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
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        singleItem: true,
                        navigation: true
                    };

                    $('#slides').owlCarousel(settings);
                },
                mobile: function () {
                    var settings = {
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        autoHeight: true,
                        navigation: true,
                        singleItem: true
                    };

                    $('#slides').owlCarousel(settings);
                },
                destroy: function () {
                    if ($('#slides').data("owlCarousel") !== undefined) {
                        $('#slides').data('owlCarousel').destroy();
                    }
                }
            },
            sub: {
                desktop: function () {
                    $('.slide-item-details').each(function () {
                        $(this).owlCarousel({
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
                    });
                },
                destroy: function () {
                    $('.slide-item-details').each(function () {
                        if ($(this).data("owlCarousel") !== undefined) {
                            $(this).data('owlCarousel').destroy()
                        }
                    })
                }
            }
        }
    };
});

