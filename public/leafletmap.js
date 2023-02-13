var map = L.map('leafletmap').setView([55, 0], 7);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
L.tileLayer('https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailWayMap</a>'
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map).on("click", function (e) {
    let sidebar = document.getElementById("sidebar")
    if (sidebar.style.display === "block") {
        sidebar.style.display = "none"
    }
    else {
        sidebar.style.display = "block"
    }
});

