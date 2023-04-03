let cGraphic;
let graphicsLayer;
let view;
let search_address;



function createChoices() {
  fetch(`/api/getAll`, {mode:"cors"})
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let all_sisters = data.sisters;
      let choicesDiv = document.getElementById('choices');
      for (const sis of all_sisters) {
        let button = document.createElement('button');
        button.innerText = sis.description;
        choicesDiv.appendChild(button);
      }
    })
    .catch(err => console.error(err));
}


/*function createChoices() {
  fetch(`/api/getAll`, {mode:"cors"})
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let all_sisters = data.sisters;
      let choicesDiv = document.getElementById('choices');
      for (const sis of all_sisters) {
        let button = document.createElement('button');
        button.innerText = sis.description;
        button.addEventListener('click', searchAddressSubmit(event))
          
          
        choicesDiv.appendChild(button);
      }
    })
    .catch(err => console.error(err));
}
*/




document.body.onload = createChoices()

function initMap(esriConfig, Map, MapView, Graphic, GraphicsLayer, locator) {
  console.log('InitMap')

  cGraphic = Graphic
  esriLocator = locator

  const map = new Map({
    basemap: "arcgis-topographic" //Basemap layer service
  });

  view = new MapView({
    map: map,
    center: [13.4050, 52.5200], //Longitude, latitude
    zoom: 13,
    container: "viewDiv"
  });

  graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

}

function getValue() {
  data = document.getElementById('search-tag').value;
  console.log('WE GOT',data)
}


function testTry(e) {
    e.preventDefault();
    const tag = document.getElementById("search-tag").value;
    fetch(`/api/getAddress?tag=${tag}`, {mode:"cors"})
    .then(response => response.json())
    .then(data => {  console.log(data); document.getElementById('Test_JS').innerText = data.address.address; })
    .catch(err => console.error(err));
}




function searchAddressSubmit(e) {
  e.preventDefault();

  console.log("searchAddressSubmit");

  const tag = document.getElementById("search-tag").value;

  let search_address;

  fetch(`/api/getAddress?tag=${tag}`, { mode: "cors" })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("Test_JS").innerText = data.sister.fullname + data.sister.address + data.sister.description + data.sister.contact;
      search_address = data.sister.address;
      const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      const params = {
        address: {
          address: search_address,
        },
      };

      let firstResult;

      esriLocator.addressToLocations(geocodingServiceUrl, params).then((results) => {
        if (results) {
          console.log("got result");
          firstResult = results[0];
          console.log(firstResult);
          console.log(firstResult.address);

          view.goTo({
            target: firstResult.location,
            zoom: 13,
          });

          placePoint = firstResult.location;
          placeInMap(placePoint);
        } else {
          console.log("Geocode was not successful");
          // If you want to provide feedback to the user on the map page:
          //document.getElementById('addressHelpBlock').innerHTML="Sorry! That search did not work, try again!";
        }
      });
    })
    .catch((err) => console.error(err));

  //prevent refresh
  return false;
}


function placeInMap(place) {
  const point = { //Create a point
    type: "point",
    longitude: place.longitude,
    latitude: place.latitude
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

  const pointGraphic = new cGraphic({
    geometry: point,
    symbol: simpleMarkerSymbol
  });
  graphicsLayer.add(pointGraphic);

  return pointGraphic;
};




