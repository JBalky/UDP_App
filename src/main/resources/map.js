//----------------------------------------------------MAP DATA-----------------------------------------------------

var map = L.map('map', {doubleClickZoom: false}).setView([22.2825, 114.1538], 18);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //center: [22.282890, 114.153694],
    maxZoom: 20,
    //minZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//---------------------------------------------------STREET DATA---------------------------------------------------

var streets = [
    {   name: "Queens Road Central",
        color: 'blue',
        coordinates: [[22.28293, 114.15559], [22.28351, 114.15513], [22.28422, 114.15415]],
        description: "Queen's Road Central was one of the first roads built by the British in Hong Kong, between 1841 and 1843. It is a major road in Central, directly connecting to both the Mid-Level Escalators, as well as the Central MTR Station."
    },

    {   name: "Stanley Street",
        color: 'blue',
        coordinates: [[22.282713, 114.155239], [22.283775, 114.154319]]
    },

    {   name: "Wellington Street",
        color: 'blue',
        coordinates: [[22.282435, 114.154961], [22.284371, 114.153496]]
    },

    {   name: "Aberdeen Street",
        color: 'blue',
        coordinates: [[22.284301, 114.153346], [22.282862, 114.151844]]
    },

    {   name: "Staunton Street",
        color: 'blue',
        coordinates: [[22.283378, 114.151275], [22.281353, 114.153507]]
    },

    {   name: "Gage Street",
        color: 'blue',
        coordinates: [[22.283924, 114.152938], [22.282554, 114.153914]]
    },

    {   name: "Peel Street",
        color: 'blue',
        coordinates: [[22.282385, 114.152364], [22.284167, 114.154199]]
    },

    {   name: "Graham Street",
        color: 'blue',
        coordinates: [[22.283954, 114.154521], [22.282142, 114.152638]]
    },

    {   name: "Gutzlaff Street",
        color: 'blue',
        coordinates: [[22.282554, 114.153346], [22.283621, 114.154446]]
    },

    {   name: "Lyndhurst Terrace",
        color: 'blue',
        coordinates: [[22.28244, 114.154961], [22.282532, 114.153922], [22.282569, 114.153063]]
    },

    {   name: "Ezra Lane",
        color: 'blue',
        coordinates: [[22.281993, 114.154628], [22.282217, 114.153904]]
    },

    {   name: "Cochrane Street",
        color: 'blue',
        coordinates: [[22.282003, 114.153855], [22.282599, 114.153952], [22.283621, 114.154961]]
    },

    {   name: "Old Bailey Street",
        color: 'blue',
        coordinates: [[22.282023, 114.153861], [22.280584, 114.153045]]
    },

    {   name: "Shelley Street",
        color: 'blue',
        coordinates: [[22.282187, 114.153475], [22.280961, 114.152343]],
        description: "Named after Adolphus Edward Shelley who was a British colonial administrator. It was orginally inhabited by Portuguese people working as clerks for larger British companies. This street also contained was the orginal location of The Club Lusitano which was a club established by prominent Portugese merchants. The club still exists today but has since moved to Ice House Street. Shelly st is also part of the central-mid-levels escalators network which opened on the street in 1993."
    },

    {   name: "Elgin Street",
        color: 'blue',
        coordinates: [[22.28314, 114.15271], [22.282448, 114.152286]]
    },

    {   name: "Tsung Wing Lane",
        color: 'blue',
        coordinates: [[22.282237, 114.15274], [22.281854, 114.153171]]
    },

    {   name: "Staveley Street",
        color: 'blue',
        coordinates: [[22.284004, 114.153759], [22.283698, 114.153456]]
    },

    {   name: "Sam Ka Lane",
        color: 'blue',
        coordinates: [[22.283800, 114.152809], [22.283383, 114.153104]]
    },

    {   name: "Jubilee Street",
        color: 'blue',
        coordinates: [[22.283808, 114.154727], [22.284532, 114.155685]]
    },

    {   name: "Queen Victoria Street",
        color: 'blue',
        coordinates: [[22.28351, 114.155132], [22.284128, 114.156023]]
    },

    {   name: "Hollywood Road",
        color: 'blue',
        coordinates: [[22.283875, 114.151726], [22.283755, 114.152112], [22.283527, 114.152466], [22.282475, 114.153121], [22.282207, 114.153432], [22.282011, 114.153866], [22.281827, 114.154502]]
    }
    // Add more streets as needed
];

var triangle=[
    { name: "Central Market", color: 'red', coordinates: [[22.28444, 114.155679], [22.284158, 114.155918], [22.283614, 114.155164], [22.283612, 114.155113], [22.283825, 114.154856], [22.283894, 114.154923]] },
    { name: "PMQ", color: 'red', coordinates: [[22.283388, 114.151302], [22.282924, 114.151855], [22.283475, 114.152412], [22.283631, 114.152225], [22.283721, 114.152077], [22.283755, 114.151962], [22.283808, 114.151868], [22.283827, 114.151769]] },
    { name: "Tai Kwun", color: 'red', coordinates: [[22.281969, 114.15388], [22.281797, 114.154486], [22.28174, 114.154625], [22.281651, 114.154631], [22.281599, 114.154617], [22.281544, 114.154633], [22.281487, 114.154682], [22.281432, 114.154692], [22.280559, 114.154392], [22.28039, 114.154397], [22.280966, 114.153316], [22.28145, 114.153593], [22.281427, 114.153641]] },
 ];

//----------------------------------------------------STREET SETTINGS-------------------------------------------------------------

var newPopupOpen = false;

streets.forEach((street, index) => {
    var polyline = L.polyline(street.coordinates, { color: street.color, weight: 20, interactive: true, smoothFactor: 0, opacity: 0.25 }).addTo(map);

    var popupContent = `
        <div class="tabs">
            <button class="tab-button" data-tab="tab1">Tab 1</button>
            <button class="tab-button" data-tab="tab2">Tab 2</button>
        </div>
        <div class="tab" id="tab1">
            <b>${street.name}</b><br><img src="images/${street.name.replace(/\\s+/g, '_')}.PNG" alt="Image" style="width: 100%; height: auto"><br>${street.description}
        </div>
        <div class="tab" id="tab2">
            Content for Tab 2
        </div>`;
//{street.name.replace(/\s+/g, '_')}

    // Function to show a tab
    function showTab(tabId, tabs, tabContents) {
        tabs.forEach(function(tab) {
            tab.classList.remove('active');
        });
        tabContents.forEach(function(content) {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

// Attach event listeners after a popup is opened
    map.on('popupopen', function(e) {
        var tabButtons = e.popup._contentNode.querySelectorAll('.tab-button'); // Get buttons in the current popup
        var tabs = e.popup._contentNode.querySelectorAll('.tab'); // Get tab contents in the current popup

        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var tabId = this.getAttribute('data-tab');
                showTab(tabId, tabs, tabs); // Pass tabs to showTab function to toggle visibility
            });
        });
    });

    var tempPopup; // Temporary popup reference

// Function to open a temporary popup on mouseover
    function showTempPopup(e) {
        // Only show the temporary popup if no click popup is open
        if (!newPopupOpen) {
            if (tempPopup) {
                map.closePopup(tempPopup);
            }
            tempPopup = L.popup()
                .setLatLng(e.latlng)
                .setContent("Temporary Info") // You might want to customize this
                .openOn(map);
        }
    }

// Function to close the temporary popup
    function closeTempPopup() {
        if (tempPopup) {
            map.closePopup(tempPopup);
            tempPopup = null; // Reset reference
        }
    }
    //-----------------------------------------------POLYLINE INTERACTION------------------------------------------------------

    polyline.on('mouseover', showTempPopup);

    // Mouseout event to close temporary popup
    polyline.on('mouseout', closeTempPopup);

    polyline.on('click', function (e) {
        var clickLatlng = e.latlng;
 {
     popup = L.popup({ minWidth: 375 })
            .setLatLng(clickLatlng)
            .setContent(popupContent)
            .openOn(map);
            e.originalEvent.stopPropagation();
            newPopupOpen = true
 }});});
/*
map.on('popupopen', function(e) {
    popupOpen = true; // Set flag when any popup opens
}).on('popupclose', function(e) {
    popupOpen = false; // Clear flag when any popup closes
});
*/
//-------------------------------------------------POLYGON INTERACTION------------------------------------------

triangle.forEach((triangle, index) => {
    var polygon = L.polygon(triangle.coordinates, { color: triangle.color, weight: 5, interactive: true, smoothFactor: 0, opacity: 0.5 }).addTo(map);

    var popupContent2 = `<b>${triangle.name}</b><br><img src="images/${triangle.name.replace(/\s+/g, '_')}.png" alt="Image" style="width: 100%; height: auto">`;

    polygon.on('mouseover', showTempPopup);

    // Mouseout event to close temporary popup
    polygon.on('mouseout', closeTempPopup);

    polygon.on('click', function (e) {
        var clickLatlng = e.latlng;

        popup = L.popup({ minWidth: 600 })
            .setLatLng(clickLatlng)
            .setContent(popupContent2)
            .openOn(map);
            e.originalEvent.stopPropagation();
        console.log("Polyline clicked", e);
        newPopupOpen = true
    })

    });
map.on('click', function () {
    if (newPopupOpen) {
        map.closePopup();
        newPopupOpen = false;
    }
});

// After defining streets and adding them to the map
var allStreetCoordinates = [].concat(...streets.map(street => street.coordinates));
map.fitBounds(allStreetCoordinates);
