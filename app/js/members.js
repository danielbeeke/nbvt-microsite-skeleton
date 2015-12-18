$(function() {
    var map = L.map('leaflet-map');
    var markerLayer = L.featureGroup().addTo(map);

    L.tileLayer(window.nbvt.members.map).addTo(map);

    var bounds = [];

    $.each(window.nbvt.members.items, function (delta, member) {
        bounds.push([member.lat, member.lng]);
    });

    map.fitBounds(bounds);

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Google(),
        showMarker: false
    }).addTo(map);

    map.on('geosearch_foundlocations', function (locations) {
        setSearch(locations.Locations[0].Y, locations.Locations[0].X)
    });

    function setSearch(lat, lng) {
        markerLayer.clearLayers();

        var membersToSort = [];

        $.each(window.nbvt.members.items, function (delta, member) {
            member.diff = Math.abs(member.lat - lat) + Math.abs(member.lng - lng);
            membersToSort.push(member)
        });

        var membersSorted = membersToSort.sort(function (a, b){
            return a.diff - b.diff;
        });

        var membersToShow = membersSorted.slice(0, 4);

        var bounds = [];

        $.each(membersToShow, function (delta, member) {
            bounds.push([member.lat, member.lng]);

            L.marker([member.lat, member.lng]).addTo(markerLayer).bindPopup(member.name)
        });

        map.fitBounds(bounds);
    }
});
