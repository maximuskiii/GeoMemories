//watches location and repeats requests
// let the user set their position with the cursor and make a memory there (essentially a memoy board)
//test test te
// maybe add marker array as the default marker addition/sorting system.
//comment out previous solution temporarily
let map = null;
let lat = null;
let lng = null;
let titleValue = null;
let messageValue = null;
let marker = null;
let marker_lat = null;
let marker_lng = null;
let result = null; 
var markerarray = [];
NodeList.prototype.indexOf = Array.prototype.indexOf

function getMarkerCoords() {
    marker_lat = marker.getPosition().lat()
    marker_lng = marker.getPosition().lng()
    console.log(marker_lat, marker_lng)
}

function getLocation() {
    if(navigator.geolocation = Geolocation) {
       // navigator.geolocation.watchPosition(showPosition);
        navigator.geolocation.getCurrentPosition(initMap);
        navigator.geolocation.getCurrentPosition(getCoords);
        console.log("getlocation works");
    } else {
        console.log("Geoloocation is not supported");
    }
}

//initializes the map object 
function updateMap(position) {
    getLocation();
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    if (map !== null) {
        map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
        map.setZoom(15);
    }
}

function initMap(position) {
    updateMap(position);
    if (map !== null) return 

    console.log("Running initmap");

    map = new google.maps.Map(document.getElementById("mapDiv"), {
        center: { lat: position.coords?.latitude , lng: position.coords?.longitude}, 
        zoom: 15,
        disableDefaultUI: true
    });
    
    let marker2 = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: map,
        icon:{
            path: 'm 12,2.4000002 c -2.7802903,0 -5.9650002,1.5099999 -5.9650002,5.8299998 0,1.74375 1.1549213,3.264465 2.3551945,4.025812 1.2002732,0.761348 2.4458987,0.763328 2.6273057,2.474813 L 12,24 12.9825,14.68 c 0.179732,-1.704939 1.425357,-1.665423 2.626049,-2.424188 C 16.809241,11.497047 17.965,9.94 17.965,8.23 17.965,3.9100001 14.78029,2.4000002 12,2.4000002 Z',
            fillColor: '#00FF00',
            fillOpacity: 1.0,
            strokeColor: '#000000',
            strokeWeight: 1,
            scale: 2,
            anchor: new google.maps.Point(12, 24),
        },
        draggable:false
    })

    marker = new google.maps.Marker({ 
        position: {lat: position.coords.latitude - 0.0001, lng: position.coords.longitude - 0.0001},
        map:map,
        draggable:true,
        animation: google.maps.Animation.DROP
    });

    infoWindow = new google.maps.InfoWindow();
    infoWindow.open(map);
}

// sendJSON method - used to send data to the router which can then make a db request.
async function sendJson(data) {
    const response = await window.fetch('http://localhost:5000/geos/server', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type" : "application/json; charset=UTF-8"
        }
    })
    return await response.json()
}

//gets the values from the form and clears the form
function getValue() {
    titleValue = document.getElementById('title').value;
    messageValue = document.getElementById('text-content').value;
    document.getElementById('title').value = '';
    document.getElementById('text-content').value = '';
}

//button for adding a new memory, sends a post request
document.querySelector('#submitMemory').addEventListener('click', async e => {
    getValue();
    console.log(`${titleValue}, ${messageValue}`)
    console.log("addData");
    if(document.getElementById("marker-coords").checked == true) {
        getMarkerCoords()
        console.log("using marker coords")
        result = await sendJson({
            command: "create-geom",
            title: titleValue, 
            text: messageValue,
            lat: marker_lat,
            lng: marker_lng
        })
    } else {
        console.log("using position coords")
        console.log(lat, lng)
        result = await sendJson({
            command: "create-geom",
            title: titleValue, 
            text: messageValue,
            lat: lat,
            lng: lng
        })
    }

    updateMemoryList()
    marker.setPosition({
        lat: lat - 0.0001,
        lng: lng - 0.0001
    })
})

//gets and updates coordinate
function getCoords(position){
    lat = `${position.coords.latitude}`
    lng = `${position.coords.longitude}`
}

//delete all data
document.querySelector('#delAll').addEventListener('click', async e => {
    console.log("delAll")
    const result = await sendJson({
        command: "del-all"
    })
    updateMemoryList()
    getMarkerCoords()
})

//get Data
document.querySelector('#center').addEventListener('click', async e => {
    console.log(Number(lat), Number(lng))
    map.setCenter({
        lat: Number(lat),
        lng: Number(lng) 
    })
})

function test(){
    console.log("this is a test")
}

//skill list 
// finish this asap for a nice UI

async function updateMemoryList() {
    for(let marker of markerarray) {
        marker.setMap(null)
    }
    markerarray = []
    const memories = await sendJson({
        command: "get-all-data"
    })

    let flex_container = document.getElementById("flexContainer");
    console.log(flex_container)
    flex_container.innerHTML = null

    for(let memory of memories) {
        let div = document.createElement("div")
        div.classList.add('memory-post')
        //const h1 = 
        div.innerHTML += `<h2>${memory.title}</h2><p>${memory.text}
        <br>Lat:${memory.lat_coord} Lng:${memory.lng_coord} <br>Created on: ${memory.createdOn}</p>
        <button class="remover" onclick='removeGeoM("${memory.title}")'> Remove Geo-Memory</button>`
        console.log(div)
        flex_container.append(div)
    }

    for(let memory of memories) {
        console.log(Number(memory.lat_coord))
        const content = `<div id="content">` +
        `<b>${memory.title}</b><br>${memory.text}<br>Lat: ${memory.lat_coord}, Lng: ${memory.lng_coord}<br>`+
        `Created on: ${memory.createdOn}<div id="removebutton"><button class="remover" onclick='removeGeoM("${memory.title}")'>Remove GeoM</button></div></div>`
        const infoWindow = new google.maps.InfoWindow({
            content: content,
            arialabel: "test"
        })
        console.log(memories.indexOf(memory))

        markerarray[memories.indexOf(memory)] = new google.maps.Marker({
            title: memory.title,
            position: {lat: Number(memory.lat_coord), lng: Number(memory.lng_coord)},  
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        })
        markerarray[memories.indexOf(memory)].addListener("click", () => {
            infoWindow.open({
                anchor: markerarray[memories.indexOf(memory)],
                map: map,
            })
        })
        for(let marker of markerarray) {
            marker.setMap(map)
        }
    }



    /*for(let memory of memories) {
        console.log(Number(memory.lat_coord))
        const content = `<div id="content">` +
        `${memory.title}<div id="removebutton"><button onclick='removeGeoM("${memory.title}")'>Remove GeoM</button></div></div>`
        const infoWindow = new google.maps.InfoWindow({
            content: content,
            arialabel: "test"
        })

        const m1 = new google.maps.Marker({
            title: memory.title,
            position: {lat: Number(memory.lat_coord), lng: Number(memory.lng_coord)}, 
            map: map, 
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        })

        //marker.setPosition({lat: Number(memory.lat_coord) - 0.001, lng: Number(memory.lng_coord)-0.001})

        m1.addListener("click", () => {
            infoWindow.open({
                anchor: m1,
                map: map,
            })
        })
    }*/
}

//function for removing an item from the client side list
async function removeGeoM(title) {
    const result = await sendJson({
        command: "del-one",
        title: title
    })
    updateMemoryList()
}

window.addEventListener("load", event => {
    updateMemoryList()
})