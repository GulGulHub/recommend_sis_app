document.addEventListener("DOMContentLoaded", function() {
  require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
  ], function (esriConfig, Map, MapView) {
    esriConfig.apiKey = "{{map_key}}";

    const map = new Map({
      basemap: "arcgis-topographic",
    });

    const view = new MapView({
      map: map,
      center: [-118.805, 34.027],
      zoom: 13,
      container: "viewDiv",
    });
  });
});
