let map, directionsService, directionsRenderer;
let startInput, endInput;
let accessibilityEnabled = false; // Track accessibility toggle state
let streetRankings = [];


function initMap(callback) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 22.282890, lng: 114.153694},
        zoom: 18,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    startInput = new google.maps.places.Autocomplete(document.getElementById('start'));
    endInput = new google.maps.places.Autocomplete(document.getElementById('end'));

    // Bias the Autocomplete results to map's viewport.
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

    let streets = [
        {
            name: "Queens Road Central",
            color: "blue",
            coordinates: [
                {lat: 22.28293, lng: 114.15559},
                {lat: 22.28351, lng: 114.15513},
                {lat: 22.28422, lng: 114.15415}
            ],
            description: "Queen's Road Central was one of the first roads built by the British in Hong Kong, between 1841 and 1843. It is a major road in Central, directly connecting to both the Mid-Level Escalators, as well as the Central MTR Station."
        },

        {
            name: "Stanley Street",
            color: "blue",
            coordinates: [
                {lat: 22.282713, lng: 114.155239},
                {lat: 22.283775, lng: 114.154319}],
            description: "One way street parallel to Queen's Road between D'Aguilar Street and Graham Street. Named after Lord Stanley who was a British Colonial Secretary."
        },


        {
            name: "Wellington Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282435, lng: 114.154961},
                {lat: 22.284371, lng: 114.153496}],
            description: "Named after Arthur Wellesley who was the 1st Duke of Wellesley. Cotains the first Catholic Church in Hong Kong which was built in 1843 and then destroyed in a fire in 1859."
        },


        {
            name: "Aberdeen Street",
            color: 'blue',
            coordinates: [
                {lat: 22.284301, lng: 114.153346},
                {lat: 22.282862, lng: 114.151844}],
            description: "Aquired its name from George Hamilton-Gordon who was the 4th Earl of Aberdeen during the time of cession of Hong Kong to the United Kingdom in the year 1842."
        },


        {
            name: "Staunton Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283378, lng: 114.151275},
                {lat: 22.281353, lng: 114.153507}],
            description: "Also known as Sam Sap Kan. Named after Sir George Statunton who was a English traveller and Orentalist. Mostly a entertainment area featuring restaurants, bars and shops."
        },


        {
            name: "Gage Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283924, lng: 114.152938},
                {lat: 22.282554, lng: 114.153914}],
            description: "Located between Cochrane Street and Lyndhurst Terrace. There is a market running along most of the street."
        },


        {
            name: "Peel Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282385, lng: 114.152364},
                {lat: 22.284167, lng: 114.154199}],
            description: "Named after Robert Peel, a two-time British Prime Minister.  The road was built in the 1840s and was settled by Westerners, was taken over by the Chinese in 1870. The section between Hollywood and Staunton was famous for its calligraphers that specialised in signboards from 1950-1960."
        },


        {
            name: "Graham Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283954, lng: 114.154521},
                {lat: 22.282142, lng: 114.152638}],
                description: "Markets date back over 160 years on Graham St. Hosted the earliest cinema in Hong Kong, the Bijou Theatre, in 1907."
},


        {
            name: "Gutzlaff Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282554, lng: 114.153346},
                {lat: 22.283621, lng: 114.154446}],
            description: "One of the oldest streets, dedicated to the 19th century Prussion Christain missionary Karl Gutzlaff, known as Red-Haired Dame street in the old days due to frequency of western shoppers for shoes, Also known as Shoe Repairing Street."
        },


        {
            name: "Lyndhurst Terrace",
            color: 'blue',
            coordinates: [
                {lat: 22.28244, lng: 114.154961},
                {lat: 22.282532, lng: 114.153922},
                {lat: 22.282569, lng: 114.153063}],
            description: "Two way street on a slope between Hollywood Rd and Wellington St. Connects to the central mid levels escalators."
        },


        {
            name: "Ezra Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.281993, lng: 114.154628},
                {lat: 22.282217, lng: 114.153904}],
            description: "none"
        },


        {
            name: "Cochrane Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282003, lng: 114.153855},
                {lat: 22.282599, lng: 114.153952},
                {lat: 22.283621, lng: 114.154961}],
            description: "Named after Thomas James Cochrane who was a rear admiral in the Royal Navy. Intially contained a build up of Cantonese residents but after the area was re-zoned in 1844 they were moved. The mid-level escalators connect Cochrane street to many stores and restaurants."
        },


        {
            name: "Old Bailey Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282023, lng: 114.153861},
                {lat: 22.280584, lng: 114.153045}],
            description: "none"
        },


        {
            name: "Shelley Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282187, lng: 114.153475},
                {lat: 22.280961, lng: 114.152343}],
            description: "Named after Adolphus Edward Shelley who was a British colonial administrator. It was orginally inhabited by Portuguese people working as clerks for larger British companies. This street also contained was the orginal location of The Club Lusitano which was a club established by prominent Portugese merchants. The club still exists today but has since moved to Ice House Street. Shelly st is also part of the central-mid-levels escalators network which opened on the street in 1993."
        },


        {
            name: "Elgin Street",
            color: 'blue',
            coordinates: [
                {lat: 22.28314, lng: 114.15271},
                {lat: 22.282448, lng: 114.152286}],
            description: "One of the first streets in Hong Kong, Elgin St is named after James Bruce who was the 8th Earl of Elgin and a British colonial administratior and diplomat. The orginal name of the street was Hung Mo Giu Gai or Foreign Girls Street because of the mostly European brothels in the area. The street was renamed following the Second Opium War. Along the street there are many shops selling trinkets, as well as many restaurants."
        },


        {
            name: "Tsung Wing Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.282237, lng: 114.15274},
                {lat: 22.281854, lng: 114.153171}],
            description: "none"
        },


        {
            name: "Staveley Street",
            color: 'blue',
            coordinates: [
                {lat: 22.284004, lng: 114.153759},
                {lat: 22.283698, lng: 114.153456}],
            description: "Named after William Staveley, who was a Lieutenant-General in the British Army. Became the Commander and Lieutenant Governor of Hong Kong in 1847."
        },


        {
            name: "Sam Ka Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.283800, lng: 114.152809},
                {lat: 22.283383, lng: 114.153104}],
            description: "none"
        },


        {
            name: "Jubilee Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283808, lng: 114.154727},
                {lat: 22.284532, lng: 114.155685}],
            description: "This street aquired its name in response to Queen Victoria's 50th year anniversary of her reign in 1887."
        },


        {
            name: "Queen Victoria Street",
            color: 'blue',
            coordinates: [
                {lat: 22.28351, lng: 114.155132},
                {lat: 22.284128, lng: 114.156023}],
            description: "Named after Queen Victoria, the reigning monarch of Britian when Hong Kong was Colonised. "
        },


        {
            name: "Hollywood Road",
            color: 'blue',
            coordinates: [
                {lat: 22.283875, lng: 114.151726},
                {lat: 22.283755, lng: 114.152112},
                {lat: 22.283527, lng: 114.152466},
                {lat: 22.282475, lng: 114.153121},
                {lat: 22.282207, lng: 114.153432},
                {lat: 22.282011, lng: 114.153866},
                {lat: 22.281827, lng: 114.154502}],
            description: "Second road built in Hong Kong, used by foreign merchants to sell antiques and artefacts from China to merchants on their way to Europe. Contains mostly antique and trinket shops. These include furniture, porcelain, rugs and scupltures. Hollywood rd also contains contemporary art galleries."
        }

    ];
    let hoverInfoWindow = new google.maps.InfoWindow();
    let infoWindow = new google.maps.InfoWindow();
    var popupOpen = false
    // Draw polyline for each street
    streets.forEach((street) => {
        let polyline = new google.maps.Polyline({
            path: street.coordinates,
            geodesic: true,
            strokeColor: street.color,
            strokeOpacity: 0.25,
            strokeWeight: 20,
        });

        polyline.setMap(map);

                polyline.addListener('mouseover', (event) => {
                    hoverInfoWindow.setContent(`<div style="padding: 5px;"><strong>${street.name}</strong></div>`);
                    // Set the position of the InfoWindow to the mouse event's location
                    hoverInfoWindow.setPosition(event.latLng);
                    hoverInfoWindow.open(map);
                });

                // Mouseout listener to close the InfoWindow
                polyline.addListener('mouseout', () => {
                    hoverInfoWindow.close();
                });

                // Adding a click listener for the polyline
                polyline.addListener('click', (event) => {
                            infoWindow.setContent(`<div style="padding: 0px;"><strong>${street.name}</strong></div><div> <img src="images/${street.name.replace(/\s+/g, '_')}.jpg" alt="No Image" style="width:100%;max-width:200px;"</div><div<strong>${street.description}</strong></div>`);
                            infoWindow.setPosition(event.latLng); // Adjust as needed
                            infoWindow.open(map);
                            hoverInfoWindow.close();
                });
    });

    // Example triangle data (simplified)
    let triangles = [
        {
            name: "Central Market",
            color: "red",
            coordinates: [
                {lat: 22.28444, lng: 114.155679},
                {lat: 22.284158, lng: 114.155918},
                {lat: 22.283614, lng: 114.155164},
                {lat: 22.283612, lng: 114.155113},
                {lat: 22.283825, lng: 114.154856},
                {lat: 22.283894, lng: 114.154923}]
        },
        {
            name: "PMQ",
            color: 'red',
            coordinates: [
                {lat: 22.283388, lng: 114.151302},
                {lat: 22.282924, lng: 114.151855},
                {lat: 22.283475, lng: 114.152412},
                {lat: 22.283631, lng: 114.152225},
                {lat: 22.283721, lng: 114.152077},
                {lat: 22.283755, lng: 114.151962},
                {lat: 22.283808, lng: 114.151868},
                {lat: 22.283827, lng: 114.151769}]
        },
        {
            name: "Tai Kwun",
            color: 'red',
            coordinates: [
                {lat: 22.281969, lng: 114.15388},
                {lat: 22.281797, lng: 114.154486},
                {lat: 22.28174, lng: 114.154625},
                {lat: 22.281651, lng: 114.154631},
                {lat: 22.281599, lng: 114.154617},
                {lat: 22.281544, lng: 114.154633},
                {lat: 22.281487, lng: 114.154682},
                {lat: 22.281432, lng: 114.154692},
                {lat: 22.280559, lng: 114.154392},
                {lat: 22.28039, lng: 114.154397},
                {lat: 22.280966, lng: 114.153316},
                {lat: 22.28145, lng: 114.153593},
                {lat: 22.281427, lng: 114.153641}]
        }

    ];

    // Draw polygon for each triangle
    triangles.forEach((triangle) => {
        let polygon = new google.maps.Polygon({
            paths: triangle.coordinates,
            strokeColor: triangle.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: triangle.color,
            fillOpacity: 0.35,
        });

        polygon.setMap(map);

                polygon.addListener('mouseover', (event) => {
                    hoverInfoWindow.setContent(`<div style="padding: 5px;"><strong>${triangle.name}</strong></div>`);
                    // Set the position of the InfoWindow to the mouse event's location
                    hoverInfoWindow.setPosition(event.latLng);
                    hoverInfoWindow.open(map);
                });

                // Mouseout listener to close the InfoWindow
                polygon.addListener('mouseout', () => {
                    hoverInfoWindow.close();
                });

                // Adding a click listener for the polyline
                polygon.addListener('click', (event) => {
                    infoWindow.setContent('<h3>${triangle.name}</h3><p>${triangle.description}</p>');
                    infoWindow.setPosition(event.latLng); // Adjust as needed
                    infoWindow.open(map);
                    hoverInfoWindow.close(map);
                });
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

        return {lat: gridSizeLat, lng: gridSizeLng};
    }
