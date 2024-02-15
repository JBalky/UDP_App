let map, directionsService, directionsRenderer;
let startInput, endInput;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 22.282890, lng: 114.153694 }, // Default center (New York City)
        zoom: 17,
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

    let streets = [
        {   name: "Queens Road Central",
            color: "blue",
            coordinates: [
                {lat: 22.28293, lng: 114.15559},
                {lat: 22.28351, lng: 114.15513},
                {lat: 22.28422, lng: 114.15415}
        ],
        description: "Description of Queens Road Central."
        },

        {   name: "Stanley Street",
            color: "blue",
            coordinates: [
                {lat: 22.282713, lng: 114.155239},
                {lat: 22.283775, lng: 114.154319}]
        },


        {   name: "Wellington Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282435, lng: 114.154961},
                {lat: 22.284371, lng: 114.153496}]
        },


        {   name: "Aberdeen Street",
            color: 'blue',
            coordinates: [
                {lat: 22.284301, lng: 114.153346},
                {lat: 22.282862, lng: 114.151844}]
        },


        {   name: "Staunton Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283378, lng: 114.151275},
                {lat: 22.281353, lng: 114.153507}]
        },


        {   name: "Gage Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283924, lng: 114.152938},
                {lat: 22.282554, lng: 114.153914}]
        },


        {   name: "Peel Street",
            color: 'blue',
            coordinates: [
            {lat: 22.282385, lng: 114.152364},
            {lat: 22.284167, lng: 114.154199}]
        },


        {   name: "Graham Street",
            color: 'blue',
            coordinates: [
            {lat: 22.283954, lng: 114.154521},
            {lat: 22.282142, lng: 114.152638}]
        },


        {   name: "Gutzlaff Street",
            color: 'blue',
            coordinates: [
            {lat: 22.282554, lng: 114.153346},
            {lat: 22.283621, lng: 114.154446}]
        },


        {   name: "Lyndhurst Terrace",
            color: 'blue',
            coordinates: [
            {lat: 22.28244, lng: 114.154961},
            {lat: 22.282532, lng: 114.153922},
            {lat: 22.282569, lng: 114.153063}]
        },


        {   name: "Ezra Lane",
            color: 'blue',
            coordinates: [
            {lat: 22.281993, lng: 114.154628},
            {lat: 22.282217, lng: 114.153904}]
        },


        {   name: "Cochrane Street",
            color: 'blue',
            coordinates: [
            {lat: 22.282003, lng: 114.153855},
            {lat: 22.282599, lng: 114.153952},
            {lat: 22.283621, lng: 114.154961}]
        },


        {   name: "Old Bailey Street",
            color: 'blue',
            coordinates: [
            {lat: 22.282023, lng: 114.153861},
            {lat: 22.280584, lng: 114.153045}]
        },


        {   name: "Shelley Street",
            color: 'blue',
            coordinates: [
            {lat: 22.282187, lng: 114.153475},
            {lat: 22.280961, lng: 114.152343}],
            description: "Named after Adolphus Edward Shelley who was a British colonial administrator. It was orginally inhabited by Portuguese people working as clerks for larger British companies. This street also contained was the orginal location of The Club Lusitano which was a club established by prominent Portugese merchants. The club still exists today but has since moved to Ice House Street. Shelly st is also part of the central-mid-levels escalators network which opened on the street in 1993."
        },


        {   name: "Elgin Street",
            color: 'blue',
            coordinates: [
            {lat: 22.28314, lng: 114.15271},
            {lat: 22.282448, lng: 114.152286}]
        },


        {   name: "Tsung Wing Lane",
            color: 'blue',
            coordinates: [
            {lat: 22.282237, lng: 114.15274},
            {lat: 22.281854, lng: 114.153171}]
        },


        {   name: "Staveley Street",
            color: 'blue',
            coordinates: [
            {lat: 22.284004, lng: 114.153759},
            {lat: 22.283698, lng: 114.153456}]
        },


        {   name: "Sam Ka Lane",
            color: 'blue',
            coordinates: [
            {lat: 22.283800, lng: 114.152809},
            {lat: 22.283383, lng: 114.153104}]
        },


        {   name: "Jubilee Street",
            color: 'blue',
            coordinates: [
            {lat: 22.283808, lng: 114.154727},
            {lat: 22.284532, lng: 114.155685}]
        },


        {   name: "Queen Victoria Street",
            color: 'blue',
            coordinates: [
            {lat: 22.28351, lng: 114.155132},
            {lat: 22.284128, lng: 114.156023}]
        },


        {   name: "Hollywood Road",
            color: 'blue',
            coordinates: [
            {lat: 22.283875, lng: 114.151726},
            {lat: 22.283755, lng: 114.152112},
            {lat: 22.283527, lng: 114.152466},
            {lat: 22.282475, lng: 114.153121},
            {lat: 22.282207, lng: 114.153432},
            {lat: 22.282011, lng: 114.153866},
            {lat: 22.281827, lng: 114.154502}]
        }

];

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

        // Adding a click listener for the polyline
        polyline.addListener('click', () => {
            let contentString = `<h3>${street.name}</h3><p>${street.description}</p>`;
            let infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            infowindow.setPosition(street.coordinates[0]); // Adjust as needed
            infowindow.open(map);
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
        {name: "PMQ",
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
        { name: "Tai Kwun",
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
                {lat: 22.281427, lng: 114.153641}]}

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

        // Adding a click listener for the polygon
        polygon.addListener('click', () => {
            let contentString = `<h3>${triangle.name}</h3>`;
            let infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            // Positioning the InfoWindow in the center of the polygon might require some calculation
            infowindow.setPosition(triangle.coordinates[0]); // This is a simplification
            infowindow.open(map);
        });
    });
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
