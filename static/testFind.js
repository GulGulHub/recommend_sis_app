
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

function getValue() {
  data = document.getElementById('search-tag').value;
  console.log('WE GOT',data)
}


function testTry() {
  const tag = document.getElementById("search-tag").value;
  fetch(`/api/getAddress?tag=${tag}`)
    .then(response => response.json())
    .then(data => { document.getElementById('Test_JS').innerText = data.address; })
    .catch(err => console.error(err));
}



function searchAddressSubmit() {

  console.log('searchAddressSubmit');

  fetch('/api/getAddress', {
    method: 'GET',
    headers: {
      tag: document.getElementById("search-tag").value,
    }
  })
    .then(response => response.json())
    .then(data => {let search_address = data.address})
    .catch(err => console.error(err));



  const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  const params = {
    address: {
      "address": search_address
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
    style: "diamond",
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




