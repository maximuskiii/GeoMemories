//watches location and repeats requests 
//test test te
let map = null;
let lat = null;
let lng = null;
let titleValue = null;
let messageValue = null;
let tempGeoMList = "";


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
    if (map !== null) {
        map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
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

    let marker = new google.maps.Marker({ 
        position: { lat: position.coords.latitude, lng: position.coords.longitude },
        map:map,
        draggarble:true
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

/*async function readDb(){
    const response = await window.fetch('http://localhost:5000/geos/server') 
    
}*/

/*document.querySelector('#get_coords_button').addEventListener('click', async e =>{
    console.log("get-coords-works")
    console.log(await readDb())
})*/

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
    addGeoMToList(messageValue);
    console.log(`${titleValue}, ${messageValue}`)
    console.log("addData");
    const result = await sendJson({
        command: "create-user",
        title: titleValue, 
        text: messageValue,
        lat: lat,
        lng: lng
    })
})

//gets and updates coordinates
function getCoords(position){
    lat = `${position.coords.latitude}`
    lng = `${position.coords.longitude}`
}

//print db (becoming print line)
function printDb(result) {
    let testp = document.getElementById('testp');
    for (let item of result) {
        testp.innerHTML += `<div> ${item.title} ${item.text} ${item.createdOn} </div>`
    }
}

//delete all data
document.querySelector('#delAll').addEventListener('click', async e => {
    console.log("delAll")
    const result = await sendJson({
        command: "dell-all"
    })
})

//get Data
document.querySelector('#getdata').addEventListener('click', async e => {
    console.log("getData")
    const result = await sendJson({
        command: "get-all-data"
    })
    //console.log(result)
    printDb(result)
})

function test(){
    console.log("this is a test")
}
//skill list 
let i = 0; 
function addGeoMToList() {
    let currentGeom = messageValue; 
    if(currentGeom != ""){
        tempGeoMList += "<li><span name='geoMItem' id='geoMItem"+ i +"'>" + 
        messageValue + "</span>" + "<a onclick='removeGeoM()'> Remove Geo-Memory </a></li>"
        i++;
        document.getElementById("geoList").innerHTML = tempGeoMList
    }
}

//function for removing an item from the client side list
async function removeGeoM() {
    console.log("inside removeGeoM")
    tempGeoMList="";
    let Geos = document.querySelectorAll("#geoList li"), index, tab = [];
    console.log(Geos)
    for(var j = 0; j< Geos.length; j++) {
        console.log("in 1st for loop")
        tab.push(Geos[j].innerHTML)
        console.log(tab)
    }
    for(var j = 0; j < Geos.length; j++) {
        console.log(j)
        console.log(Geos[j])
        console.log(Geos[j].parentNode)
        Geos[j].onclick = () => {
            console.log("inside onclick")
            Geos[j].remove(Geos[j])
            tab.splice(j,1)
        }
    }
}

