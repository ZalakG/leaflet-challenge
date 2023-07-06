console.log("logic_1.js");

let theMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

let myMap = L.map("map", {
  center: [40.7, -94.5],
  zoom: 5,
  // layers:[ topo, theMap]
});

theMap.addTo(myMap);

let baseMaps = {
  Street: theMap,
};

let earthquakes = new L.LayerGroup();

let overlays = {
  Earthquakes: earthquakes,
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(myMap);

d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(function (data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
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

  // Create map legend to provide context for map data
  let legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [10, 30, 50, 70, 90];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo;

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
      labels.push(
        '<ul style="background-color:' +
          chooseColor(grades[i] + 1) +
          '"> <span>' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "" : "+") +
          "</span></ul>"
      );
    }

    // add each label list item to the div under the <ul> tag
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;    
  };

  //legend.addTo(myMap);

});
