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

            $(window).on('resize', function () {
                clearTimeout(debounceTimeout);

                debounceTimeout = setTimeout(function () {
                    slidesController.handleContext()
                }, 300);
            });

            slidesController.handleContext()
        },
        handleContext: function () {
            if ($(window).width() >= 1280) {
                if (slidesController.previousContext != 'desktop') {
                    slidesController.sliders.main.destroy();
                    slidesController.sliders.sub.destroy();

                    slidesController.sliders.main.desktop();
                    slidesController.sliders.sub.desktop();
                }

                slidesController.previousContext = 'desktop';
            }
            else {

                if (slidesController.previousContext != 'mobile') {
                    slidesController.sliders.main.destroy();
                    slidesController.sliders.sub.destroy();
                    slidesController.sliders.main.mobile();
                }

                slidesController.previousContext = 'mobile';
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
                        paginationSpeed : 300,
                        autoHeight: true,
                        navigation: true,
                        singleItem: true
                        //afterAction: function () {
                        //    setTimeout(function () {
                        //        $("#slides").each(function(){
                        //            $(this).data('owlCarousel').updateVars();
                        //        });
                        //    }, 300)
                        //}
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

