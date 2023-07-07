console.log("logic.js");

// Add the tile layer that will be the ackground of the map.
var theMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

// Add the topo layer that will be the ackground of the map.
var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// Create myMap object
let myMap = L.map("map", {
  center: [40.7, -94.5],
  zoom: 3,
  // layers:[ topo, theMap]
});

topo.addTo(myMap);


// Create baseMaps object
let baseMaps = {
  "Light Global": theMap,
  "Global Earthquakes": topo,
};


// Initialize the layerGroups
let tectonicplates = new L.LayerGroup();
let earthquakes = new L.LayerGroup();


// Create an overlay object to hold  overlay
let overlays = {
  "Tectonic Plates": tectonicplates,
  Earthquakes: earthquakes,
};

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlays, { collapsed: true }).addTo(myMap);


// Get the Earthquak GeoJSON data using d3 
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
 
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

   // Get marker sixe by magnitude
   function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Create a GeoJson layer containing the features array
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

// Create map legend to provide context for map data
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");
  labels = ["<strong>Depth</strong>"];
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML += labels.push(
      '<i class="circle" style="background:' +
        getColor(depth[i]) +
        '"></i> ' +
        (depth[i] ? depth[i] : "+")
    );
  }
  div.innerHTML = labels.join("<br>");
  return div;
};

// Get marker color by depth
function getColor(depth) {
  if (depth > 90) {
    return "#ea2c2c";
  }
  if (depth > 70) {
    return "#ea822c";
  }
  if (depth > 50) {
    return "#ee9c00";
  }
  if (depth > 30) {
    return "#eecc00";
  }
  if (depth > 10) {
    return "#d4ee00";
  }
  return "#98ee00";
}

legend.addTo(myMap);

earthquakes.addTo(myMap);


  

