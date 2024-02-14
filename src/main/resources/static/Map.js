let map, directionsService, directionsRenderer;
let startInput, endInput;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 22.281929805768996, lng: 114.15822437981622 }, // Default center (New York City)
        zoom: 16,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Initialize autocomplete inputs
    startInput = new google.maps.places.Autocomplete(
        document.getElementById('start'));
    endInput = new google.maps.places.Autocomplete(
        document.getElementById('end'));

    // Bias the Autocomplete results to map's viewport.
    startInput.bindTo('bounds', map);
    endInput.bindTo('bounds', map);
}

function calculateAndDisplayRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING,
    }, (response, status) => {
        if (status === 'OK') {

            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
