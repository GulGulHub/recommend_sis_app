var firstResult;

/* function testJs() {
  const testTry = document.getElementsByClassName("search_address").innerText;
  document.getElementById("Test_JS").innerText = testTry;
}

let table = document.getElementById("myTable");
table.addEventListener("load", function() {
  testJs();
});
 */

function testJs() {
  document.getElementById("Test_JS").innerText = db_address;
}


function initMap(esriConfig, Map, MapView, Graphic, GraphicsLayer) {
  console.log('InitMap')

  const map = new Map({
      basemap: "arcgis-topographic" //Basemap layer service
    });
  
    const view = new MapView({
      map: map,
      center: [13.4050, 52.5200], //Longitude, latitude
      zoom: 13,
      container: "viewDiv"
   });
  
   const graphicsLayer = new GraphicsLayer();
   map.add(graphicsLayer); 

}



function searchAddressSubmit() {
  // Took bits and pieces from here for this feature: https://developers.arcgis.com/documentation/mapping-apis-and-services/search/geocoding/
  console.log('searchAddressSubmit');

  const address = document.getElementById("search_address").value;

  const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  const params = {
    address: {
      "address": address
    }
  }

  esriLocator.addressToLocations(geocodingServiceUrl, params).then((results) => {
    if (results.length) {
      let firstResult = results[0];
      console.log(firstResult.location);

      view.goTo({
        target: firstResult.location,
        zoom: 13
      });

      placeInMap(firstResult);
    } 
    
    else {
      console.log("Geocode was not successful");
      // If you want to provide feedback to the user on the map page:
      //document.getElementById('addressHelpBlock').innerHTML="Sorry! That search did not work, try again!";
    } 
  });
 //prevent refresh
 return false;
}


function placeInMap(place) {
  const point = { //Create a point
    type: "point",
    longitude: place.lng,
    latitude: place.lat
 };
 const simpleMarkerSymbol = {
    type: "simple-marker",
    style:"diamond",
    color: [226, 119, 40],  // Orange
    outline: {
        color: [255, 255, 255], // White
        width: 1
    }
 };

 const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol
 });
 graphicsLayer.add(pointGraphic);

 return pointGraphic;
};




