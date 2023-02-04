//watches location and repeats requests
// let the user set their position with the cursor and make a memory there (essentially a memoy board)
//test test te
// maybe add marker array as the default marker addition/sorting system.
//comment out previous solution temporarily
//maybe fix aspect ratio things for images
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
var img_src = null;
var marker_colors = ["#3333ff", "#cc00ff", "#00cc00", "#ff3300", "#9999ff", "#ff9999", "#00cc66", "#cc9900", "#339933", "#6600ff"];
NodeList.prototype.indexOf = Array.prototype.indexOf
var coll = document.getElementsByClassName("collapsible"); 
var iterate; 

for (iterate = 0; iterate < coll.length; iterate++) {
    coll[iterate].addEventListener("click", function() {
        this.classList.toggle("active");
      var content1 = this.nextElementSibling;
      if (content1.style.display === "block") {
        content1.style.display = "none";
      } else {
        content1.style.display = "block";
      }
    });
  }
  

const input = document.querySelector('input[type="file"]')
input.addEventListener('change', (e) => {
    document.getElementById("display-image").innerHTML = ""
    console.log(input.files)
    const reader = new FileReader()
    reader.onload = () => {
        img_src = reader.result
        const app_img = `<b>Image Preview</b><br><img src="${img_src}" width="150" height="150" style="border-radius: 15px">`
        //img.src = reader.result
        document.getElementById("display-image").innerHTML += app_img
    }
    reader.readAsDataURL(input.files[0])
})

/* async function updateGeoM(title, message, img_src, temp_lat, temp_lng) {
        var temp_img_src = img_src;
        var temp_lat_coord = temp_lat;
        var temp_lng_coord = temp_lng;
        document.getElementById('title').value = title;
        document.getElementById('text-content').value = message;
        const result = await sendJson({
            command: "del-one", 
            title: title,
        })
        updateMemoryList()
        var new_title_value = document.getElementById('title').value
        var new_message_value = document.getElementById('text-content').value
        //myLatLng = {lat: Number(temp_lat_coord), lng: Number(temp_lng_coord)}
        //marker.setPosition(myLatLng);
        document.querySelector('#editMemory').addEventListener('click', async e => {
            if(document.getElementById("marker-coords").checked == true) {
                getMarkerCoords()
                console.log("using marker coords")
                const result = await sendJson({
                    command: "create-geom",
                    title: new_title_value, 
                    text: new_message_value,
                    lat: marker_lat,
                    lng: marker_lng,
                    img_src: img_src,
                })
            } else {
                console.log("using position coords")
                console.log(lat, lng)
                result = await sendJson({
                    command: "create-geom",
                    title: new_title_value, 
                    text: new_message_value,
                    lat: lat,
                    lng: lng,
                    img_src: img_src,
                })
                
                marker.setPosition({
                    lat: lat - 0.0001,
                    lng: lng - 0.0001
                })
            }
            updateMemoryList()
            document.getElementById('title').value = '';
            document.getElementById('text-content').value = ''
        })
} */ 

async function updateGeoM(title, message, temp_img_src, lat, lng) {
    let u_title = title;
    document.getElementById('title').value = title;
    document.getElementById('text-content').value = message;
    const app_img2 = `<b>Image Preview</b><br><img src="${temp_img_src}" width="120" height="120" style="border-radius: 15px">`
    document.getElementById("display-image").innerHTML += app_img2
    document.querySelector("#editMemory").addEventListener("click", async e => {
        if(document.getElementById("marker-coords").checked == true) {
            getMarkerCoords()
            const result = await sendJson({
                command: "update-one",
                fetchTitle: u_title,
                title: document.getElementById('title').value,
                text: document.getElementById('text-content').value,
                lat: marker_lat, 
                lng: marker_lng, 
                img_src: img_src
            })
            updateMemoryList()
        } else {
            const result = await sendJson({
                command: "update-one", 
                fetchTitle: u_title,
                title: document.getElementById('title').value,
                text: document.getElementById('text-content').value,
                lat: lat, 
                lng: lng, 
                img_src: img_src
            })
            updateMemoryList()
        }
        
    })
}

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
        //disableDefaultUI: true
    });
    
    let marker2 = new google.maps.Marker({
        position: {lat: position.coords.latitude, lng: position.coords.longitude},
        map: map,
        icon:{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        },
        draggable:false,
        animation: google.maps.Animation.DROP
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
            lng: marker_lng,
            img_src:img_src,
        })
    } else {
        console.log("using position coords")
        console.log(lat, lng)
        result = await sendJson({
            command: "create-geom",
            title: titleValue, 
            text: messageValue,
            lat: lat,
            lng: lng,
            img_src: img_src,
        })
    }

    updateMemoryList()
    marker.setPosition({
        lat: lat - 0.0001,
        lng: lng - 0.0001
    })
    img_src = null;
})

// ctrl k c
// ctrl k u

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
    map.setZoom(15);
})

function test(){
    console.log("this is a test")
}

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
        let image = new Image()
        image.src = memory.img_src
        let div = document.createElement("div")
        div.classList.add('memory-post')
        //const h1 =
        div.innerHTML += `<div class="post-title"><h2>${memory.title}</h2></div><div class="post-content"><img src="${image.src}" class="img">
        <div class="post-message"><p>${memory.text}</p></div>
        <p>Lat:${memory.lat_coord} Lng:${memory.lng_coord} <br>Created on: ${memory.createdOn}</p></div>
        <div class="buttonHolder2"><button class="remover" onclick='removeGeoM("${memory.title}")'> Remove GeoMemory</button>
        <button class="remover" onclick='updateGeoM("${memory.title}", "${memory.text}","${memory.img_src}","${memory.lat_coord}","${memory.lng_coord}")'> Edit GeoMemory</button></div>`
        console.log(div)
        flex_container.append(div)
    }

    for(let memory of memories) {
        console.log(Number(memory.lat_coord))
        let image = new Image()
        image.src = memory.img_src
        const content = `<div class="content">` +
        `<div class="marker-infoWindow-main"><div class="marker-infoWindow-title"><b>${memory.title}</b></div><img src="${image.src}" class="img"><div class="marker-infoWindow-message">${memory.text}</div></div><div class="marker-infoWindow-extra">Lat: ${memory.lat_coord}, Lng: ${memory.lng_coord}<br>`+
        `Created on: ${memory.createdOn}<div id="removebutton"><button class="remover" onclick='removeGeoM("${memory.title}")'>Remove GeoM</button><button class="remover" onclick='updateGeoM("${memory.title}", "${memory.text}","${memory.img_src}","${memory.lat_coord}","${memory.lng_coord}")'> Edit GeoMemory</button><div></div></div>`
        const infoWindow = new google.maps.InfoWindow({
            content: content,
            arialabel: "test"
        })
        console.log(memories.indexOf(memory))

        markerarray[memories.indexOf(memory)] = new google.maps.Marker({
            title: memory.title,
            position: {lat: Number(memory.lat_coord), lng: Number(memory.lng_coord)},  
            icon: {
                path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: marker_colors[memories.indexOf(memory)],
                fillOpacity: 0.8,
                strokeWeight: 0,
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(0, 20),
            },
            animation: google.maps.Animation.DROP
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
        document.getElementById("display-image").innerHTML = ""
        document.getElementById("file-input").value =""
        document.getElementById('title').value = "";
        document.getElementById('text-content').value = "";
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
    document.getElementById("marker-coords").checked = true;
})
