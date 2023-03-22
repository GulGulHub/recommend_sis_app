

 const basemapEnum = "ArcGIS:Streets";

 const map = L.map("map", {
minZoom: 2
}).setView([34.02, -118.805], 13);

   L.esri.Vector.vectorBasemapLayer(basemapEnum, {
        apiKey: apiKey
      }).addTo(map);


      var trailheads = L.esri
        .featureLayer({
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0"
        });

   trailheads.addTo(map);

//var map = L.map('map').setView([37.837, -122.479], 8);
//
//  L.esri.basemapLayer('Streets').addTo(map);
//
//  var icon = L.icon({
//    iconUrl: 'https://esri.github.io/esri-leaflet/img/earthquake-icon.png',
//    iconSize: [27, 31],
//    iconAnchor: [13.5, 17.5],
//    popupAnchor: [0, -11]
//  });
//
//  L.esri.featureLayer({
//    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0',
//    pointToLayer: function (geojson, latlng) {
//      return L.marker(latlng, {
//        icon: icon
//      });
//    }
//  }).addTo(map);









//const searchControl = L.esri.Geocoding.geosearch({
//position: "topright",
//placeholder: "Enter an address or place e.g. 1 York St",
//useMapBounds: false,


//providers: [
 // L.esri.Geocoding.arcgisOnlineProvider({
   // apikey: apiKey,
   // nearby: {
     // lat: 52.520008,
      //lng: 13.404954
    //}
  //})
//]

//}).addTo(map);//

//const results = L.layerGroup().addTo(map);
//
//searchControl.on("results", (data) => {
//results.clearLayers();
//
//for (let i = data.results.length - 1; i >= 0; i--) {
//  const marker = L.marker(data.results[i].latlng);
//
//  const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000) / 100000}, ${
//    Math.round(data.results[i].latlng.lat * 100000) / 100000
//  }`;
//  marker.bindPopup(`<b>This could be any text</b><p>${data.results[i].properties.LongLabel}</p>`);
//
//  results.addLayer(marker);
//
//    marker.openPopup();
//
//}
//
//});

