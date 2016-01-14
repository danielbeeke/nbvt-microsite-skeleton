$(function() {



    var map, markerLayer, geoSearch;




    // Init the map.
    function init() {
        // Creating the map.
        map = L.map('leaflet-map', {
            attributionControl: false,
            zoomControl: false,
            //scrollWheelZoom: false
        });
        markerLayer = L.featureGroup().addTo(map);

        L.tileLayer(window.nbvt.members.map).addTo(map);

        geoSearch = new L.Control.GeoSearch({
            provider: new L.GeoSearch.Provider.Google(),
            showMarker: false
        }).addTo(map);

        // Not the most clean plugin, but hey it works.
        $('.members-filters').rememberState({
            clearOnSubmit: false
        });

        // Click on the notice of the form plugin.
        $('.remember_state a').click();


        // On filter change.
        $('.members-filters input').on('change', function () {
            setSearch(oldLat, oldLng, getFilters(), true);
        })

        $('.member-filters-search').on('click', function () {
            geoSearch.geosearch(geoSearch._searchbox.value);
            return false
        })


        // Setting the initial state of the map.
        var bounds = [];

        $.each(window.nbvt.members.items, function (delta, member) {
            bounds.push([member.lat, member.lng]);
        });

        if (!map.restoreView() && bounds.length) {
            map.fitBounds(bounds);
        }

        var oldLat = localStorage.getItem('searchLat');
        var oldLng = localStorage.getItem('searchLng');

        if (oldLat && oldLng) {
            setSearch(oldLat, oldLng, getFilters());
        }





        // On search.
        map.on('geosearch_foundlocations', function (locations) {
            var filters = getFilters();

            oldLat = locations.Locations[0].Y;
            oldLng = locations.Locations[0].X;

            localStorage.setItem('searchLat', oldLat);
            localStorage.setItem('searchLng', oldLng);

            setSearch(oldLat, oldLng, filters, true, true);
        });

    }




    // Returns all the keys of the tags that are in the current filter.
    function getFilters() {
        var filters = [];

        if ($('[name="filters-groups"]:checked').length) {
            var currentQuery = $('[name="filters-groups"]:checked').data('query').split(' ');

            $(currentQuery).each(function (delta, queryPart) {
                if (queryPart) {
                    filters.push(queryPart)
                }
            });

            $('.filters-enhance :checked').each(function (delta, option) {
                filters.push($(option).val())
            });
        }

        return filters;
    }




    // Sets the map.
    function setSearch(lat, lng, filters, fitBounds, scrollTo) {
        markerLayer.clearLayers();

        var membersToSort = [];

        $.each(window.nbvt.members.items, function (delta, member) {
            if (!mustHide(member, filters)) {
                member.diff = Math.abs(member.lat - lat) + Math.abs(member.lng - lng);
                membersToSort.push(member)
            }
        });

        var membersSorted = membersToSort.sort(function (a, b){
            return a.diff - b.diff;
        });

        var membersToShow = membersSorted.slice(0, 4);

        var bounds = [];

        $.each(membersToShow, function (delta, member) {
            bounds.push([member.lat, member.lng]);

            var mapIcon = L.divIcon({ html: '<i class="fa fa-map-marker"></i>', className: member.active ? 'active' : '' });

            L.marker([member.lat, member.lng], { icon: mapIcon }).addTo(markerLayer).on('click', function () {
                window.location = '/leden/' + member.slug;
            })
        });

        if (fitBounds && bounds.length) {
            map.fitBounds(bounds);
        }

        if (scrollTo) {
            $('html, body').animate({
                scrollTop: $('.leaflet-map').offset().top - $('.page-header').height()
            }, 400)
        }
    }




    // Checks if a member must be shown.
    function mustHide(member, filters) {
        var mustHide = false;
        $(filters).each(function (delta, filter) {
            if ($.inArray(filter, member.tags) == -1) {
                mustHide = true;
            }
        });

        return mustHide;
    }

    // TODO decide if we will show a map on member pages if on mobile.
    init();
});
