  const apiKey = "{{MAP_KEY}}";

   const basemapEnum = "ArcGIS:Navigation";

      const map = L.map("map", {
        minZoom: 2
      })

      map.setView([48.8566, 2.3522], 13); // Paris

      L.esri.Vector.vectorBasemapLayer(basemapEnum, {
        apiKey: apiKey
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);

      map.on("click", function (e) {

        L.esri.Geocoding
          .reverseGeocode({
            apikey: apiKey
          })
          .latlng(e.latlng)

          .run(function (error, result) {
            if (error) {
              return;
            }

            layerGroup.clearLayers();

            marker = L.marker(result.latlng).addTo(layerGroup);

            const lngLatString = `${Math.round(result.latlng.lng * 100000) / 100000}, ${Math.round(result.latlng.lat * 100000) / 100000}`;

            marker.bindPopup(`<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`);
            marker.openPopup();

          });

      });