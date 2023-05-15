let cGraphic;
let graphicsLayer;
let view;
let search_address;
let firstResult;
let savedSearches = [];
const geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";


/* creating choices for the buttons from all the sisters in the database*/
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



/* gets the tag value of the constructed buttons and calls the api to get the address*/


function onClickValue() {
  const tag = this.value; /* get value from onclick*/
  console.log(tag);
  console.log("searchAddressSubmit");
  let search_address;
  let target_div = document.getElementById("Test_JS");

  fetch(`/api/getAddress?tag=${tag}`, { mode: "cors" }) /* makes api call */
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let all_searches = data.sister
      let header_text = document.createElement("h3")
      target_div.appendChild(header_text)               /* adds the tag as heade-text*/
      for (const search_item of all_searches) {         /* for item from db: create text and get address for call later*/
        const search_results = search_item;
        savedSearches.push(search_results);
        console.log("&&&&", search_item)
        console.log("!!!", savedSearches)
        header_text.innerText = `${search_item.description} : `
        let sis_text = document.createElement("div")
        sis_text.innerText = search_item.fullname + " - " + search_item.address + " - " + search_item.description + " - " + search_item.contact;
        sis_text.onclick = function () {
          callEsriAndZoom(search_item);    /* I added this so that if there are too many choices there is an easy zoom*/
        }
        target_div.appendChild(sis_text);

        /** EsriCall is the resolved Promise from callEsriAndZoom it is the firstResult */
        callEsriAndZoom(search_item)
        .then((EsriCall) => {
          console.log(EsriCall);
          SetMarker(EsriCall, search_item);
        })
        .catch((error) => console.error(error));
      };
    })
    .catch ((err) => console.error(err));
  //prevent refresh
  return false;
}



/* function that will show all sisters on map and below */

function showAllOnMap() {
  let search_address;
  let target_div = document.getElementById("Test_JS");

  fetch(`/api/getAll`, { mode: "cors" }) /* makes api call */
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let all_searches = data.sisters
      console.log("!!HIER!!", data.sisters)
      for (const search_item of all_searches) {         /* for item from db: create text and get address for call later*/
        console.log("!!!", search_item)
        let header_text = document.createElement("h3")
        target_div.appendChild(header_text)               /* adds the tag as heade-text*/
        header_text.innerText = `${search_item.description} : `
        let sis_text = document.createElement("div")
        sis_text.innerText = search_item.fullname + " - " + search_item.address + " - " + search_item.description + " - " + search_item.contact;
        sis_text.setAttribute("id", "sis_text")
        sis_text.onclick = function () {
          callEsriAndZoom(search_item);    /* I added this function so that if there are too many choices there is an easy zoom*/
        }
        target_div.appendChild(sis_text);

        callEsriAndZoom(search_item)
        .then((EsriCall) => {
          console.log(EsriCall);
          SetMarker(EsriCall, search_item);
        })
        .catch((error) => console.error(error));
      }
    })

    .catch((err) => console.error(err));

  //prevent refresh
  return false;
}



/* function that creates a point from the address.location above */
function placeInMap(place, fullname, tag, address, contact) {
  const point = { //Create a point
    type: "point",
    longitude: place.longitude,
    latitude: place.latitude
  };

  /* creates the actual symbol/text on the map */
  let textSymbol = {
    type: "text",  // autocasts as new TextSymbol()
    color: "#200589",
    backgroundColor: "#ab20fd",
    text: fullname,
    xoffset: 3,
    yoffset: 3,
    font: {  // autocasts as new Font()
      size: 8,
      family: "Arial",
      weight: "bold"
    }
  };

  /* creates a popup */
  const pointGraphic = new cGraphic({
    geometry: point,
    symbol: /*simpleMarkerSymbol*/ textSymbol,
    popupTemplate: {
      title: fullname,
      content: `${tag} : ${address} \n  ${contact}`,
      actions: [
        {
          title: "View Profile",
          id: "view",
          image: "./static/heim.png",
        }
      ]
    }
  });

  graphicsLayer.add(pointGraphic);

  // this handles the click on "View Details"
  view.popup.on("trigger-action", (event) => {
    console.log(fullname)
    window.open("/home")
  });

  return pointGraphic;
};


function clearMarkers() {
  graphicsLayer.removeAll();
  let target_div = document.getElementById("Test_JS");
  target_div.textContent = '';
}


/** this function will save the search to the favorites */
function save_all() {
  fetch(`/api/saveSearches`, {
    method: 'POST',
    body: JSON.stringify(savedSearches),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status == 200) {
        alert('Search item saved successfully!');

      } else {

        throw new Error('Failed to save search item');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error saving search item');
    });

}


function callEsriAndZoom(search_item) {
  return new Promise((resolve, reject) => {
    search_address = search_item.address;
    const params = {
      address: {
        address: search_address,
      },
    };

    esriLocator.addressToLocations(geocodingServiceUrl, params)
      .then((results) => {
        if (results) {
          console.log("got result");
          const firstResult = results[0];
          console.log(firstResult);
          console.log(firstResult.address);

          view.goTo({
            target: firstResult.location,
            zoom: 14,
          });

          resolve(firstResult);
        } else {
          console.log("Geocode was not successful");
          reject(new Error("Geocode was not successful"));
        }
      })
      .catch((error) => reject(error));
  });
}




function SetMarker(firstResult, search_item) {
  console.log("SET MARKER IS RUNNING")
  placePoint = firstResult.location;
  placeInMap(placePoint, search_item.fullname, search_item.description, search_item.address, search_item.contact);
}