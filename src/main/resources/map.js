var map = L.map('map').setView([22.2825, 114.1538], 18);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var latlngs = [
    [22.28293, 114.15559],
    [22.28351, 114.15513],
    [22.28422, 114.15415]
];

var polyline = L.polyline(latlngs, {color: 'red', weight: 10, interactive: true}).addTo(map);
//polyline.bindPopup('Happy Sunday').openPopup({ closePopupOnClick: false });
var popupContent = '<b>Queens Road Central</b><br><img src="images/Queens_Road.png" alt="Image" style="width: 100%; height: auto">'
var popupOpen = false; // Flag to track the popup state

polyline.on('mouseover', function(e){
    if (!popupOpen)
        var tempPopup = L.popup()
            .setLatLng(e.latlng)
            .setContent("Queen's Road Central")
            .openOn(map);
});

polyline.on('mouseout', function(e) {
    if (!popupOpen) {
        map.closePopup();
    }
});

polyline.on('click', function(e) {
    var clickLatlng = e.latlng; // Get the latitude and longitude where the polyline was clicked
    var popup = L.popup ({minWidth: 600})
        .setLatLng(clickLatlng) // Set the popup at the click location
        .setContent(popupContent)
        .openOn(map); // Open the popup on the map
            popupOpen = !popupOpen;
    if (popupOpen) {
        L.DomEvent.preventDefault(event);
    }
});

map.fitBounds(polyline.getBounds());


// var marker = L.marker([22.28351, 114.15553]).addTo(map);