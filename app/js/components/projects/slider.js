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
                slidesController.sliders.main.desktop();
            }
            else {
                slidesController.sliders.main.destroy();

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

                    $('#project-slider').owlCarousel(settings);
                },
                mobile: function () {
                    var settings = {
                        slideSpeed : 300,
                        paginationSpeed : 400,
                        autoHeight: true,
                        singleItem: true
                    };

                    $('#project-slider').owlCarousel(settings);
                },
                destroy: function () {
                    if ($('#project-slider.owl-theme').length) {
                        $('#project-slider.owl-theme').data('owlCarousel').destroy()
                    }
                }
            },
        }
    };
});







//$(function() {
//
//
//    $('#project-slider').owlCarousel({
//        slideSpeed : 300,
//        paginationSpeed : 400,
//        singleItem: true
//    });
//
//
//});
//
