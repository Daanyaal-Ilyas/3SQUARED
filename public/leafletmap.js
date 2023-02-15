var map = L.map('leafletmap').setView([55, 0], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer('https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailWayMap</a>'
}).addTo(map);


//button
const button = document.getElementById("button-hide");
const label = document.getElementById("hide");

button.addEventListener("click", function() {
    if (label.style.display === "block") {
      label.style.display = "none"
    }
    else {
        label.style.display ="block"
    }
});