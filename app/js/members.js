$(function() {

    // CREATING THE MAP /////////////////////////////////////////
    var map = L.map('leaflet-map');
    var markerLayer = L.featureGroup().addTo(map);

    L.tileLayer(window.nbvt.members.map).addTo(map);

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Google(),
        showMarker: false
    }).addTo(map);
    // CREATING THE MAP /////////////////////////////////////////




    // SETTING THE INITIAL STATE OF THE MAP /////////////////////
    var bounds = [];

    $.each(window.nbvt.members.items, function (delta, member) {
        bounds.push([member.lat, member.lng]);
    });

    if (!map.restoreView()) {
        map.fitBounds(bounds);
    }

    var oldLat = localStorage.getItem('searchLat');
    var oldLng = localStorage.getItem('searchLng');

    if (oldLat && oldLng) {
        setSearch(oldLat, oldLng, getFilters());
    }
    // SETTING THE INITIAL STATE OF THE MAP /////////////////////




    // ON SEARCH ////////////////////////////////////////////////
    map.on('geosearch_foundlocations', function (locations) {
        var filters = getFilters();
        setSearch(locations.Locations[0].Y, locations.Locations[0].X, filters, true);

        localStorage.setItem('searchLat', locations.Locations[0].Y)
        localStorage.setItem('searchLng', locations.Locations[0].X)
    });
    // ON SEARCH ////////////////////////////////////////////////




    // ON FILTER CHANGE /////////////////////////////////////////
    $('.members-filters input').on('change', function () {
        setSearch(oldLat, oldLng, getFilters());
    })
    // ON FILTER CHANGE /////////////////////////////////////////



    // Returns all the keys of the tags that are in the current filter.
    function getFilters() {
        var filters = [];

        var currentQuery = $('[name="filters-groups"]:checked').data('query').split(' ');

        $(currentQuery).each(function (delta, queryPart) {
            if (queryPart) {
                filters.push(queryPart)
            }
        })

        $('.filters-enhance :checked').each(function (delta, option) {
            filters.push($(option).val())
        })

        return filters;
    }



    // Sets the map.
    function setSearch(lat, lng, filters, fitBounds) {
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

            L.marker([member.lat, member.lng]).addTo(markerLayer).on('click', function () {
                window.location = '/leden/' + member.name.replace(/ /g,"-").toLowerCase();
            })
        });

        if (fitBounds) {
            map.fitBounds(bounds);
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
});
