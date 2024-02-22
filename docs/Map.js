let map, directionsService, directionsRenderer;
let startInput, endInput;
let accessibilityEnabled = false; // Track accessibility toggle state
let streetRankings = [];


function initMap(callback) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 22.282890, lng: 114.153694 },
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
        {   name: "Queens Road Central",
            color: "blue",
            coordinates: [
                {lat: 22.28293, lng: 114.15559},
                {lat: 22.28351, lng: 114.15513},
                {lat: 22.28422, lng: 114.15415}
            ],
            description: "One of the busiest commerical areas in Hong Kong and contains many commerical buildings as well as restaurants and shopping. This includes the Central Market and  The Center office building.",
            history: "Queens Road Central holds a pivotal place in Hong Kong's colonial history as one of the earliest roads laid down in the 1840s during the British occupation. It was named after Queen Victoria and originally formed the shoreline of Hong Kong Island before land reclamation efforts pushed the coast further north. This road has witnessed the transformation of Hong Kong from a modest trading outpost to the bustling financial hub it is today, retaining its status as a key commercial artery in the heart of the city."
        },

        {   name: "Stanley Street",
            color: "blue",
            coordinates: [
                {lat: 22.282713, lng: 114.155239},
                {lat: 22.283775, lng: 114.154319}],
            description: "Stanley Street is particularly famous for its array of camera shops, offering both the latest models and vintage finds, making it a haven for photography enthusiasts. Alongside its photographic allure, Stanley Street is surrounded by a variety of local eateries, traditional tea houses, and international dining options, reflecting the multicultural tapestry of Hong Kong. Its close proximity to other notable landmarks, such as the Central-Mid-Levels escalator and the bustling Lan Kwai Fong entertainment area, further adds to its appeal as a must-visit destination for tourists and locals alike.",
            history: "Stanley Street has been a focal point of Hong Kong’s photography industry since the 1950s. Nestled in the Central district, it became synonymous with camera trading, with numerous shops selling both contemporary and classic equipment. The street's name pays homage to Lord Stanley, a British colonial secretary, and it has been instrumental in documenting the city's rapidly changing skyline through the lenses of local and visiting photographers over the decades."
        },


        {   name: "Wellington Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282435, lng: 114.154961},
                {lat: 22.284371, lng: 114.153496}],
            description: "Wellington Street, stretching through the heart of Hong Kong's Central district, is a vibrant thoroughfare known for its culinary delights. Renowned for its diverse range of dining options, the street boasts a plethora of traditional Cantonese dim sum restaurants, trendy cafes, and international cuisines, offering a taste of Hong Kong's rich gastronomic culture. Among its most famous attractions is the historic Lin Heung Tea House, a destination for those seeking an authentic dim sum experience in a traditional setting. Wellington Street's lively atmosphere, combined with its architectural charm that ranges from colonial-era buildings to modern facades, encapsulates the dynamic blend of old and new that characterizes Hong Kong. This street not only serves as a culinary hotspot but also as a gateway to exploring the nearby art galleries, boutiques, and the historic Man Mo Temple.",
            history: "Wellington Street, named after the Duke of Wellington, is renowned for its culinary legacy in Central Hong Kong. The street is home to the Lin Heung Tea House, opened in the 1920s, which stands as one of the oldest and most iconic dim sum restaurants in the city. This historic eatery has served generations and has been a steadfast witness to the evolution of the traditional Cantonese culinary scene amidst the modernizing cityscape."
        },


        {   name: "Aberdeen Street",
            color: 'blue',
            coordinates: [
                {lat: 22.284301, lng: 114.153346},
                {lat: 22.282862, lng: 114.151844}],
            description: "Aberdeen Street, nestled in Central Hong Kong's SoHo district, offers a unique mix of the old and new. This street, known for its vibrant street art and trendy cafes, is a cultural nexus that seamlessly blends Hong Kong's rich heritage with contemporary lifestyle. It is home to the PMQ, a landmark that once served as the Police Married Quarters and now stands as a creative arts and dining hub. With its close proximity to the historic Man Mo Temple and the lively Lan Kwai Fong area, Aberdeen Street provides a picturesque setting for those looking to explore Hong Kong's diverse attractions within a compact urban space.",
            history: "Aberdeen Street marks the historic boundary between the Chinese-influenced Sheung Wan and the British colonial Central district. It is named after the 4th Earl of Aberdeen and has been an understated witness to the cultural integration and friction during the early colonial era. Today, the street bridges the past and present with landmarks like PMQ, which once served as the Police Married Quarters and now is a center for creative and design industries."
        },


        {   name: "Staunton Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283378, lng: 114.151275},
                {lat: 22.281353, lng: 114.153507}],
            description: "Staunton Street is renowned for its eclectic mix of fashionable boutiques, art galleries, and a wide array of dining options, ranging from street food stalls to upscale restaurants. A notable landmark on Staunton Street is the historic Hong Kong Escalator, the world's longest outdoor covered escalator system, providing easy access to the area's many attractions. The street's lively atmosphere is enhanced by its proximity to the cultural and entertainment hubs of Lan Kwai Fong and the PMQ.",
            history: "Staunton Street's history is intimately tied to the cultural development of Hong Kong's SoHo district. Named after Sir George Thomas Staunton, an influential figure in early British trade with China, the street has transformed from residential beginnings to a vibrant cultural quarter. It was along these very sidewalks that the city's intellectuals and artists first began to gather, setting the stage for the area's current reputation as a haven for creativity and entertainment."
        },


        {   name: "Gage Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283924, lng: 114.152938},
                {lat: 22.282554, lng: 114.153914}],
            description: "Gage Street, a bustling artery in Central Hong Kong, is celebrated for its traditional market vibe and culinary diversity. This lively street is home to one of Hong Kong's oldest wet markets, offering an authentic glimpse into the daily life of locals with its array of fresh produce, seafood, and butcheries. Flanked by historic tenement buildings, the street is also a hotspot for food enthusiasts, featuring a variety of local eateries and street food stalls that serve up some of the city's best-loved dishes.",
            history: "Gage Street is named after British military officer William Hall Gage and has been an integral part of Hong Kong's Central District since the colonial era. It is renowned for its longstanding Gage Street Market, a traditional wet market established in the early 20th century. The market has been a cornerstone of daily life, providing fresh local produce and a sense of community continuity amidst the changing urban environment."
        },


        {   name: "Peel Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282385, lng: 114.152364},
                {lat: 22.284167, lng: 114.154199}],
            description: "Peel Street in Central Hong Kong's SoHo district offers a vibrant mix of dining and nightlife, highlighted by its proximity to the Mid-Levels Escalator and Man Mo Temple. This bustling street is known for its diverse eateries and bars, making it a lively spot for food enthusiasts and night owls alike.",
            history: "Peel Street, with a name derived from British Prime Minister Sir Robert Peel, is steeped in the history of Hong Kong's trade and industry. Historically a residential area, it evolved to host a bustling marketplace as the city's population grew. The street has seen the ebb and flow of daily commerce for over a century and remains a testament to the enduring spirit of the city's local businesses and the adaptability of its historic neighborhoods."
        },


        {   name: "Graham Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283954, lng: 114.154521},
                {lat: 22.282142, lng: 114.152638}],
            description: "Graham Street, nestled in Central Hong Kong, is famous for its historic Graham Street Market, one of the city's oldest street markets. Offering fresh produce and local delicacies, it's a lively hub for experiencing Hong Kong's culinary culture. The street's close proximity to the Mid-Levels Escalator also makes it easily accessible for exploring the surrounding SoHo district's dining and shopping options.",
            history: "Graham Street has been the lifeblood of Central Hong Kong's marketplace scene since the 1840s, making its Graham Street Market one of the oldest surviving street markets in the city. Named after Captain James Graham, this street has sustained generations of locals with its fresh produce and vibrant community, witnessing Hong Kong's transformation from a colonial port to a major global metropolis."
        },


        {   name: "Gutzlaff Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282554, lng: 114.153346},
                {lat: 22.283621, lng: 114.154446}],
            description: "Gutzlaff Street, a quaint pathway in Central Hong Kong, is renowned for its intimate dining spots and unique charm. Easily accessible via the Mid-Levels Escalator, it provides a serene escape from the city's hustle and bustle. The street is a stone's throw away from the vibrant SoHo district, making it a convenient spot for exploring nearby culinary and cultural attractions.",
            history: "Gutzlaff Street, named after the 19th-century missionary Karl Gutzlaff, has a rich legacy as a cross-cultural meeting ground. Known for its proximity to the former Victoria Prison, the oldest in Hong Kong, the street has seen a diverse tapestry of residents and visitors, reflecting the complex interweaving of international influences that have shaped the city's unique character."
        },


        {   name: "Lyndhurst Terrace",
            color: 'blue',
            coordinates: [
                {lat: 22.28244, lng: 114.154961},
                {lat: 22.282532, lng: 114.153922},
                {lat: 22.282569, lng: 114.153063}],
            description: "Lyndhurst Terrace, located in the heart of Central Hong Kong, is a bustling street known for its eclectic mix of shops, art galleries, and cafes. Directly accessible via the Mid-Levels Escalator, this street offers a vibrant shopping and dining experience, with easy access to nearby landmarks like the historic Man Mo Temple and the lively entertainment area of Lan Kwai Fong.",
            history: "Lyndhurst Terrace traces its roots back to the 19th century and is named after Lyndhurst Hall in Hampshire, England. It stands as a witness to the city's colonial past and its evolution into a modern financial center. The street has seen the rise of commercial establishments and was once the site of the famous Tiger Balm Garden, showcasing the eclectic influence of traditional Chinese and modern Western cultures in the fabric of Hong Kong."
        },


        {   name: "Ezra Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.281993, lng: 114.154628},
                {lat: 22.282217, lng: 114.153904}],
            description: "Ezra Lane, a hidden gem in Central Hong Kong, offers a quiet respite from the city's hustle. Tucked away near the Mid-Levels Escalator, this narrow alley is known for its intimate cafes and specialty shops, providing a unique, serene shopping and dining experience. Its close proximity to the vibrant SoHo district and the historic Man Mo Temple adds to its appeal, making it a must-visit for those exploring the area's rich tapestry of culture and history.",
            history: "Ezra Lane may be easy to miss in the bustling streets of Central Hong Kong, but its discreet charm harks back to the days when it was a refuge for artists and writers in the city's burgeoning cultural scene. This narrow passageway, likely named after a prominent local figure or family, has retained its quiet allure amidst the urban rush, providing a snapshot into the contemplative side of Hong Kong's past."
        },


        {   name: "Cochrane Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282003, lng: 114.153855},
                {lat: 22.282599, lng: 114.153952},
                {lat: 22.283621, lng: 114.154961}],
            description: "Cochrane Street, stretching up the steep incline from Central to the Mid-Levels, is bustling with activity. It's lined with a variety of shops, local eateries, and the entrance to the Mid-Levels Escalator, making it a vital conduit for pedestrians. This street is not just a shopper's paradise but also a convenient starting point for visiting nearby attractions like the lively Lan Kwai Fong, the tranquil Hong Kong Park, and the educational Dr. Sun Yat-sen Museum, offering a comprehensive experience of Hong Kong's dynamic urban life.",
            history: "Cochrane Street, climbing steeply from Central towards the Mid-Levels, was named after Thomas Cochrane, the 10th Earl of Dundonald, a naval figure of the Napoleonic Wars. The street's history is marked by its role in easing congestion in the growing colonial city, and today it stands lined with modern shops, yet its sloping path still echoes with the footsteps of its 19th-century origins."
        },


        {   name: "Old Bailey Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282023, lng: 114.153861},
                {lat: 22.280584, lng: 114.153045}],
            description: "Old Bailey Street, tucked away in the SoHo district of Central Hong Kong, is steeped in history and ambiance. This narrow street is best known for its tranquil atmosphere, offering a quieter dining and shopping experience away from the city's hustle. Key attractions nearby include the Tai Kwun Centre for Heritage and Arts, a revitalized colonial-era prison and police station complex, and the serene Hollywood Road Park, making it a cultural and peaceful retreat within the urban landscape.",
            history: "Old Bailey Street has a storied past, once flanking the Central Prison, Hong Kong's first jail, established in the mid-19th century. Named after the famous street in London known for the Old Bailey courthouse, it has been a silent observer to the tales of reformation and justice. Today, it serves as a cultural corridor leading to the Tai Kwun Centre for Heritage and Arts, preserving its link to legal history while embracing contemporary culture."
        },


        {   name: "Shelley Street",
            color: 'blue',
            coordinates: [
                {lat: 22.282187, lng: 114.153475},
                {lat: 22.280961, lng: 114.152343}],
            description: "Shelley Street, renowned for its part in the Central-Mid-Levels Escalator system, is a bustling thoroughfare that offers a unique blend of modernity and tradition. The street is lined with a variety of restaurants and bars, making it a popular spot for both locals and tourists. Its accessibility via the world's longest outdoor covered escalator system allows for easy exploration of the surrounding SoHo district, with landmarks like the Man Mo Temple and the vibrant PMQ arts hub just a short walk away.",
            //"Named after Adolphus Edward Shelley who was a British colonial administrator. It was orginally inhabited by Portuguese people working as clerks for larger British companies. This street also contained was the orginal location of The Club Lusitano which was a club established by prominent Portugese merchants. The club still exists today but has since moved to Ice House Street. Shelly st is also part of the central-mid-levels escalators network which opened on the street in 1993."
            history: "Shelley Street's claim to historical fame lies in its inclusion in the Central-Mid-Levels escalator system, the longest of its kind in the world. The street, possibly named after Percy Bysshe Shelley, the English poet, has evolved from a residential lane to a vibrant artery pulsating with the energy of restaurants and bars, connecting the traditions of old Hong Kong with the innovative spirit of the present."
        },


        {   name: "Elgin Street",
            color: 'blue',
            coordinates: [
                {lat: 22.28314, lng: 114.15271},
                {lat: 22.282448, lng: 114.152286}],
            description: "Elgin Street, a lively destination in the heart of SoHo, Central Hong Kong, is famous for its vibrant dining scene, featuring an array of international cuisines and local favorites. This street's energetic nightlife and cultural offerings draw a diverse crowd, with easy access to the Mid-Levels Escalator enhancing its appeal. Nearby landmarks include the historic Man Mo Temple and the PMQ, offering a mix of cultural experiences, shopping, and dining options that highlight the dynamic spirit of Hong Kong.",
            history: "Elgin Street, named after James Bruce, the 8th Earl of Elgin, is a testament to the cosmopolitan legacy of Hong Kong. Historically a residential area, it has transformed into a lively dining hub, reflecting the city's evolution from a colonial outpost to a global metropolis. Its alignment with the arts and dining scene captures the essence of Hong Kong's continuous adaptation and cultural fusion."
        },


        {   name: "Tsung Wing Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.282237, lng: 114.15274},
                {lat: 22.281854, lng: 114.153171}],
            description: "Tsung Wing Lane, nestled in the bustling district of Central Hong Kong, is a hidden gem known for its architectural intrigue and quaint ambiance. This narrow alleyway, less traversed by the typical tourist, offers a glimpse into the quieter side of city life. It's a short distance from the vibrant SoHo area and the historic Man Mo Temple, making it a peaceful detour amidst the urban excitement, ideal for those seeking solace from the city's frenetic pace.",
            history: "Tsung Wing Lane, with its discreet presence in the heart of Central, echoes the quieter aspects of Hong Kong's history. This lane, named after a notable figure or concept lost to time, has witnessed the ebb and flow of daily life against the backdrop of the city's rapid urban development. Its secluded location offers a rare glimpse into the intimate side of city living, amidst the shadows of towering skyscrapers."
        },


        {   name: "Staveley Street",
            color: 'blue',
            coordinates: [
                {lat: 22.284004, lng: 114.153759},
                {lat: 22.283698, lng: 114.153456}],
            description: "Staveley Street, situated in the vibrant Central district, is a small yet significant street that captures the essence of Hong Kong's rich history and modern evolution. Known for its proximity to the Central Police Station compound, now the Tai Kwun Centre for Heritage and Arts, Staveley Street offers cultural enthusiasts a convenient base to explore this major arts and leisure destination. Its location offers an intimate look at the architectural transformation from colonial Hong Kong to its current cosmopolitan identity.",
            history: "Staveley Street, a small but historically significant thoroughfare, is named after a British military officer, showcasing the colonial military influence on Hong Kong's urban landscape. This street has seen the transformation of its surrounding area from a strategic military outpost to a vibrant cultural district, housing the Tai Kwun Centre for Heritage and Arts, a symbol of the adaptive reuse of historical sites in modern Hong Kong."
        },


        {   name: "Sam Ka Lane",
            color: 'blue',
            coordinates: [
                {lat: 22.283800, lng: 114.152809},
                {lat: 22.283383, lng: 114.153104}],
            description: "Sam Ka Lane, a discreet alley in Central Hong Kong, is a testament to the area's historical depth and cultural layers. Close to the traditional markets of Graham Street, it provides a stark contrast to the nearby modern developments. This lane is a fascinating spot for those interested in the everyday life and rhythms of local residents, set against the backdrop of Hong Kong's rapid urban development. Nearby attractions like the PMQ and Hollywood Road provide ample opportunity for exploration into the city's artistic and historical narratives.",
            history: "Sam Ka Lane, nestled in the heart of Central, carries the legacy of Hong Kong's vibrant maritime trade. Historically a gathering place for sailors and traders, the lane was a focal point for commerce and exchange, contributing to the area's development as a bustling port. Today, it stands as a reminder of the city's rich trading history, juxtaposed against its modern financial skyline. Its name, meaning 'Three Streets Lane,' hints at the interconnectedness of community life in the city's past, where small alleys like this were the lifelines of local economies and social interaction."
        },


        {   name: "Jubilee Street",
            color: 'blue',
            coordinates: [
                {lat: 22.283808, lng: 114.154727},
                {lat: 22.284532, lng: 114.155685}],
            description: "Jubilee Street, in the heart of Central Hong Kong, stands out for its blend of commercial vibrancy and historical significance. This street is a hub for business and leisure, with easy access to the nearby IFC Mall and the Central Ferry Piers, offering stunning views of Victoria Harbour. Jubilee Street's proximity to the historic Central Market, an Art Deco building currently being revitalized, adds a cultural dimension to this bustling area, making it a key spot for those who appreciate both modernity and heritage.",
            history: "Jubilee Street, commemorating Queen Victoria's Diamond Jubilee in 1897, is a significant thoroughfare in Central Hong Kong that has evolved alongside the city itself. Once a residential street housing British officials and local workers, it has grown into a major commercial avenue. The street's transformation is emblematic of Hong Kong's rapid development from a colonial era into its present-day status as a global financial hub."
        },


        {   name: "Queen Victoria Street",
            color: 'blue',
            coordinates: [
                {lat: 22.28351, lng: 114.155132},
                {lat: 22.284128, lng: 114.156023}],
            description: "Queen Victoria Street is characterized by its quiet charm amidst the bustling district of Central Hong Kong. Known for its architectural diversity, the street is a stone's throw away from the lively Lan Kwai Fong and SoHo districts, offering a retreat from the city's nightlife. Its location offers easy access to cultural landmarks such as the PMQ and the Dr. Sun Yat-sen Museum, providing a tranquil corridor for those interested in exploring the quieter side of Hong Kong's rich urban tapestry.",
            history: "Queen Victoria Street, named in honor of the British monarch, is steeped in the colonial history of Hong Kong. Running through the heart of the Central district, this street was pivotal in the 19th century for connecting key commercial areas with the administrative centers of the British colonial government. Over the years, it has transformed into a bustling commercial artery, yet it retains historical buildings that serve as reminders of its colonial past, standing amidst modern skyscrapers and illustrating the city's unique blend of Eastern and Western influences."
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
                {lat: 22.281827, lng: 114.154502}],
            description: "Hollywood Road, one of Hong Kong's oldest streets, is renowned for its antique shops and art galleries, making it a cultural artery in the heart of the city. Stretching through Sheung Wan and Central, it offers a unique journey through Hong Kong's history, with landmarks like the Man Mo Temple and the former Central Police Station, now Tai Kwun, where art meets heritage. The vibrant street murals and trendy cafes interspersed among traditional establishments make Hollywood Road a must-visit for art lovers and history buffs alike, offering a colorful mosaic of Hong Kong's past and present.",
            history: "Hollywood Road, one of the first roads built by the British in Hong Kong after the colony was established in 1842, is renowned for its antique shops and art galleries. This historic road was named for its holly trees, not the famous California district, and quickly became a central marketplace for Chinese antiques and artifacts. Notably, it is home to the Man Mo Temple, a significant Taoist temple dedicated to the God of Literature (Man) and the God of War (Mo), dating back to the 1840s. Hollywood Road's rich history and cultural significance make it a fascinating snapshot of Hong Kong's transition from a colonial port to a global metropolis, embodying the city's tradition of cultural preservation amidst rapid urban development."
        }

    ];

    function toggleDescription(streetName, type) {
        const street = streets.find(s => s.name.replace(/\s+/g, '') === streetName);
        const descriptionDiv = document.getElementById(`description-${streetName}`);
        const image = document.getElementById(`image-${streetName}`);

        if (type === 'new') {
            descriptionDiv.innerHTML = `<h3>${street.name}</h3><p>${street.description}</p>`;
            image.src = `New${street.name}.png`.replace(/\s/g, '%20');
        } else { // Assuming 'history' is the type
            descriptionDiv.innerHTML = `<h3>${street.name}</h3><p>${street.history || 'Historical information not available.'}</p>`;
            image.src = `History${street.name}.jpg`.replace(/\s/g, '%20');
        }

        // Refresh the infowindow to adjust to new content size
        window.currentInfowindow.setContent(document.getElementById(`content-${streetName}`).parentNode.innerHTML);
        window.currentInfowindow.open(map);
    }
    function getHistoryDescription(streetName) {
        // Placeholder function to return historical description
        // Replace with actual logic to retrieve historical descriptions
        return `Historical information about ${streetName}.`;
    }

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

        polyline.addListener('click', (event) => {
            const streetNameSanitized = street.name.replace(/\s+/g, '');
            let imagePathNew = `New/${street.name}.png`.replace(/\s/g, '%20');
            let contentString = `
<div id="content-${streetNameSanitized}" style="max-width: 300px;">
    <img id="image-${streetNameSanitized}" src="${imagePathNew}" alt="Image of ${street.name}" style="width:100%; height:auto; object-fit: contain;">
    <div id="description-${streetNameSanitized}">
        <h3>${street.name}</h3>
        <p>${street.description}</p>
    </div>
    <button onclick="window.toggleDescription('${streetNameSanitized}', 'new')">Now</button>
    <button onclick="window.toggleDescription('${streetNameSanitized}', 'history')">History</button>
</div>`;

            let infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            infowindow.setPosition(event.latLng);
            infowindow.open(map);
            window.currentInfowindow = infowindow;
        });
    });

    window.toggleDescription = function(streetNameSanitized, type) {
        const street = streets.find(s => s.name.replace(/\s+/g, '') === streetNameSanitized);
        const imageElement = document.getElementById(`image-${streetNameSanitized}`);
        const descriptionDiv = document.getElementById(`description-${streetNameSanitized}`);

        if (type === 'new') {
            imageElement.src = imageElement.src = `New/${street.name}.png`.replace(/\s/g, ' ');

            descriptionDiv.innerHTML = `<h3>${street.name}</h3><p>${street.description}</p>`;
        } else {
            imageElement.src = imageElement.src = `History/${street.name}.jpg`.replace(/\s/g, ' ');

            descriptionDiv.innerHTML = `<h3>${street.name}</h3><p>${street.history || 'Historical information not available.'}</p>`;
        }

        // Update the content of the current infowindow to reflect changes
        window.currentInfowindow.setContent(document.getElementById(`content-${streetNameSanitized}`).parentNode.innerHTML);
        window.currentInfowindow.open(map);
    };



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

// Helper function to convert meters to latitude and longitude degrees
function convertMetersToDegrees(gridSize) {
    const earthCircumference = 40075017; // in meters, around the equator
    const metersPerDegree = earthCircumference / 360; // meters per degree

    const gridSizeLat = gridSize / metersPerDegree; // grid size in latitude degrees
    const gridSizeLng = gridSize / (metersPerDegree * Math.cos(startPoint.lat() * (Math.PI / 180))); // adjust for longitude

    return { lat: gridSizeLat, lng: gridSizeLng };
}
