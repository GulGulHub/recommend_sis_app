/**
- create search adress form search_item.address
- const greocoding param - die ist gleicbleibend, einfach nach oben???
- const pramaeters = address:
- dann macht der esri locater sienen job



*/


/* function to call ESRI - providing a parameters to call the Esri locator */

function callEsriAndZoom(params, search_item) {
  return new Promise((resolve, reject) => {
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