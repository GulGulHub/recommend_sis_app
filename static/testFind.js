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
    
     const point = { //Create a point
        type: "point",
        longitude: 13.4050,
        latitude: 52.5200
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
    
  
  }





