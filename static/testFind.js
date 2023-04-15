let cGraphic;
let graphicsLayer;
let view;
let search_address;

/* creating choices for the buttons from all the sisters in the database*/

/* function createChoices() {
  fetch(`/api/getAll`, { mode: "cors" })  
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let all_sisters = data.sisters;
      let choicesDiv = document.getElementById('choices');
      for (const sis of all_sisters) { 
        let button = document.createElement('button');
        button.innerText = sis.description;
        button.value = sis.description;
        button.onclick = onClickValue;
        choicesDiv.appendChild(button);
      }
    })
    .catch(err => console.error(err));
}
 */

function createChoices() {
  fetch(`/api/getDescriptions`, { mode: "cors" })  
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let all_sisters = data.sisters;
      let choicesDiv = document.getElementById('choices');
      for (const sis of all_sisters) { 
        let button = document.createElement('button');
        button.innerText = sis;
        button.value = sis;
        button.onclick = onClickValue;
        choicesDiv.appendChild(button);
      }
    })
    .catch(err => console.error(err));
}

document.body.onload = createChoices()

/* initialize the Map from Esri */

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






function onClickValue(){
  const tag = this.value;
  console.log(tag);


  console.log("searchAddressSubmit");

  let search_address;
  let target_div = document.getElementById("Test_JS");

  fetch(`/api/getAddress?tag=${tag}`, { mode: "cors" })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let all_searches = data.sister
      let header_text = document.createElement("h3")
      target_div.appendChild(header_text)
      for (const search_item of all_searches) {
        console.log("!!!", search_item)
        header_text.innerText = `${search_item.description} : ` 
        let sis_text = document.createElement("div")
        sis_text.innerText = search_item.fullname + " - " + search_item.address + " - " + search_item.description + " - " + search_item.contact;
        sis_text.setAttribute("id","sis_text")
        target_div.appendChild(sis_text);
        search_address = search_item.address;
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
              zoom: 12,
            });

            placePoint = firstResult.location;
            placeInMap(placePoint, search_item.fullname, search_item.description, search_item.address, search_item.contact);
          } else {
            console.log("Geocode was not successful");
            // If you want to provide feedback to the user on the map page:
            //document.getElementById('addressHelpBlock').innerHTML="Sorry! That search did not work, try again!";
          }
        });
      }
    })
    .catch((err) => console.error(err));

  //prevent refresh
  return false;
}


function placeInMap(place, fullname, tag, address, contact) {
  const point = { //Create a point
    type: "point",
    longitude: place.longitude,
    latitude: place.latitude
  };
  const simpleMarkerSymbol = {
    type: "simple-marker",
    style: "diamond",
    color: [255, 105, 180],  // Hotpink
    outline: {
      color: [255, 255, 255], // White
      width: 3
    }
  };
  

  const pointGraphic = new cGraphic({
    geometry: point,
    symbol: simpleMarkerSymbol,
    popupTemplate: {
      title: fullname,
      content:`${tag} : ${address} \n  ${contact}`,
      actions: [{
        title: "View Details",
        id: "view",
        param: 1 // this is an additional attribute I added to be able to know the item id and costruct the detail page url on click
      }]
    }
  });

  graphicsLayer.add(pointGraphic);

  return pointGraphic;

};




