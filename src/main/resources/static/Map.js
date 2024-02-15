let map, directionsService, directionsRenderer;
let startInput, endInput;
let accessibilityEnabled = false; // Track accessibility toggle state
let streetRankings = [];


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 22.281929805768996, lng: 114.15822437981622 },
        zoom: 16,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    startInput = new google.maps.places.Autocomplete(document.getElementById('start'));
    endInput = new google.maps.places.Autocomplete(document.getElementById('end'));

    startInput.bindTo('bounds', map);
    endInput.bindTo('bounds', map);

    // Listen for changes to the accessibility checkbox
    document.getElementById('accessibility').addEventListener('change', async (e) => {
        console.log("Accessibility toggle changed.");
        accessibilityEnabled = e.target.checked;
        console.log(`Accessibility is now ${accessibilityEnabled ? "enabled" : "disabled"}.`);
        calculateAndDisplayRoute();

        if (accessibilityEnabled) {
            await fetchAndStoreStreetRankings();
        }
    });
}


async function fetchAndStoreStreetRankings() {
    console.log("Fetching street rankings...");
    try {
        const response = await fetch('http://localhost:3000/getStreetRankings');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        streetRankings = await response.json();
        streetRankings.sort((a, b) => b.rank - a.rank);
        console.log("Fetched and sorted street rankings: ", streetRankings);
    } catch (error) {
        console.error('Error fetching street rankings:', error);
    }
}

function integrateStreetRankingsWithSegmentation(routePath) {
    console.log("Integrating street rankings with segmentation...");
    if (!streetRankings.length) {
        console.log("No street rankings available to integrate.");
        return;
    }
    const proximityThreshold = 100; // meters
    streetRankings.forEach(street => {
        const streetLatLng = new google.maps.LatLng(street.lat, street.lng);
        let isNearRoute = false;
        for (let i = 0; i < routePath.length; i++) {
            const routePoint = routePath[i];
            const distance = google.maps.geometry.spherical.computeDistanceBetween(streetLatLng, routePoint);
            if (distance < proximityThreshold) {
                isNearRoute = true;
                break;
            }
        }
        if (isNearRoute) {
            console.log(`Street near route: ${street.name}, Rank: ${street.rank}`);
        }
    });
    console.log("Integration complete.");
}

// function adjustRouteForAccessibility(originalRoute) {
//     scoredSegments = segmentMapAndAssignScores();
//     // Placeholder: Logic to adjust the route based on street rankings and current location.
//     // This is a complex problem that would involve analyzing the route's steps,
//     // matching them with the streets in your rankings, and potentially recalculating
//     // segments of the route based on the rankings.
//     // For now, we'll log a message indicating this function should be implemented.
//     console.log("Adjusting route for accessibility...");
// }

// function calculateAndDisplayRoute() {
//     const start = document.getElementById('start').value;
//     const end = document.getElementById('end').value;
//
//     directionsService.route({
//         origin: start,
//         destination: end,
//         travelMode: google.maps.TravelMode.WALKING,
//     }, (response, status) => {
//         if (status === 'OK') {
//             if (accessibilityEnabled) {
//                 adjustRouteForAccessibility(response);
//                 // Set the directions renderer to display the route in red
//                 directionsRenderer.setOptions({
//                     polylineOptions: {
//                         strokeColor: 'red'
//                     }
//                 });
//             } else {
//                 // Set the directions renderer to display the route in the default color
//                 directionsRenderer.setOptions({
//                     polylineOptions: {
//                         strokeColor: 'blue ' // default color
//                     }
//                 });
//             }
//             directionsRenderer.setDirections(response);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }

function calculateAndDisplayRoute() {
    console.log("Calculating and displaying route...");
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    // Always use WALKING as the travel mode
    const travelMode = google.maps.TravelMode.WALKING;

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: travelMode,
        provideRouteAlternatives: true, // Request alternative routes
    }, (response, status) => {
        if (status === 'OK') {
            // Default to the first (best) route if accessibility is enabled, otherwise use the second route if available
            let routeIndex = accessibilityEnabled || response.routes.length === 1 ? 0 : 1;

            // Clear previous routes from the map
            if (directionsRenderer) {
                directionsRenderer.setMap(null);
            }

            // Create a new DirectionsRenderer for the selected route
            directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                routeIndex: routeIndex, // Use the determined route index
                polylineOptions: {
                    strokeColor: accessibilityEnabled ? 'red' : 'blue', // Red for accessibility enabled, blue otherwise
                    strokeOpacity: 0.7,
                    strokeWeight: 5,
                }
            });

            console.log(accessibilityEnabled ? "Accessibility mode enabled. Showing the best route in red..." : "Accessibility mode not enabled. Showing the second-best route in blue...");
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}



// // This function assumes you have the start and end points as Google Maps LatLng objects
// function segmentMap(startPoint, endPoint, gridSize) {
//     // Convert grid size from meters to degrees
//     const gridSizeInDegrees = convertMetersToDegrees(gridSize);
//
//     // Determine the bounds of the grid
//     const bounds = new google.maps.LatLngBounds();
//     bounds.extend(startPoint);
//     bounds.extend(endPoint);
//
//     // Calculate the number of grid cells needed
//     const startLatLng = { lat: startPoint.lat(), lng: startPoint.lng() };
//     const endLatLng = { lat: endPoint.lat(), lng: endPoint.lng() };
//     const gridWidth = Math.ceil(Math.abs(startLatLng.lng - endLatLng.lng) / gridSizeInDegrees.lng);
//     const gridHeight = Math.ceil(Math.abs(startLatLng.lat - endLatLng.lat) / gridSizeInDegrees.lat);
//
//     // Initialize grid with empty values
//     const grid = Array.from({ length: gridHeight }, () =>
//         Array.from({ length: gridWidth }, () => ({
//             streets: [],
//             accessibilityScore: 0,
//         }))
//     );

    // Populate the grid with streets and calculate accessibility scores
    // This step is complex and involves checking which streets intersect with each grid cell
    // and then assigning an accessibility score to the cell based on the rankings
    // This is where you'd use the streetRankings data
    // ...

//     return grid;
// }



// Helper function to convert meters to latitude and longitude degrees
function convertMetersToDegrees(gridSize) {
    const earthCircumference = 40075017; // in meters, around the equator
    const metersPerDegree = earthCircumference / 360; // meters per degree

    const gridSizeLat = gridSize / metersPerDegree; // grid size in latitude degrees
    const gridSizeLng = gridSize / (metersPerDegree * Math.cos(startPoint.lat() * (Math.PI / 180))); // adjust for longitude

    return { lat: gridSizeLat, lng: gridSizeLng };
}

