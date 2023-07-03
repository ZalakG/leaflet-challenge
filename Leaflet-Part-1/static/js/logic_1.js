console.log("logic.js");

let theMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

let myMap = L.map("map", {
  center: [37.6, -95.665],
  zoom: 4.6,
  //layers:[theMap]
});

theMap.addTo(myMap);

let baseMaps = {
  "Street": theMap,
  
};

// Create an overlay object to hold our overlay.
let overlayMaps = {
  Earthquakes: earthquakes
};

L.control.layers(baseMaps, overlays, { collapsed: flase }).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getColor(magnitude) {
    if (magnitude > 90) {
      return "#ea2c2c";
    }
    if (magnitude > 70) {
      return "#ea822c";
    }
    if (magnitude > 50) {
      return "#ee9c00";
    }
    if (magnitude > 30) {
      return "#eecc00";
    }
    if (magnitude > 10) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,

    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          "<br>Location: " +
          feature.properties.place
      );
    },
  }).addTo(earthquakes);

  earthquakes.addTo(myMap);

});
  