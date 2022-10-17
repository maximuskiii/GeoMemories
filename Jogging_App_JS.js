//watches location and repeats requests 
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
        navigator.geolocation.watchPosition(initMap);
        navigator.geolocation.getCurrentPosition(centerMap);
    } else {
        console.log("Geoloocation is not supported");
        //logs error if it is not possible to get geolocation
    }
}
function showPosition(position) {
    console.log("Latitude: " +position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude);        
}

//initializes the map object 
function initMap(position) {
    getLocation();
    console.log("Running initmap")
    let map = new google.maps.Map(document.getElementById("mapDiv"), {
        center: { lat: position.coords.latitude , lng: position.coords.longitude }, 
        zoom: 15,
        disableDefaultUI: true
    });
    var marker = new google.maps.Marker({ 
        position: { lat: position.coords.latitude, lng: position.coords.longitude},
        map:map,
        draggarble:true
    });
    infoWindow = new google.maps.InfoWindow();
    infoWindow.open(map)
}

function centerMap(position) {
    getLocation();
     document.getElementById("mapDiv").setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
}