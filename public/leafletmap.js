var map = L.map('leafletmap').setView([55, 0], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer('https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailWayMap</a>'
}).addTo(map);

// blue = route
      var blueIcon = L.icon({
        iconUrl: '/icons/Blue.png',
        iconSize:     [15, 15], // size of the icon
      });
// red = stations
      var redIcon = L.icon({
        iconUrl: '/icons/Red.png',
        iconSize:     [50, 50], // size of the icon

      });

      async function getData(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
      }

  function DisplayLastLocation(schedule) {
  getData(api_livetrain + `/${schedule.activationId}/${schedule.scheduleId}`)
    .then((json) => {
      const lastUpdate = json[json.length - 1];
      if (lastUpdate) {
        if (lastUpdate.latLong) {
          const lat = lastUpdate.latLong.latitude;
          const long = lastUpdate.latLong.longitude;
          L.marker([lat, long], { icon: redIcon }).addTo(map).on("click", function () {
            let sidebar = document.getElementById("sidebar");
            if (sidebar.style.display === "none") {
              sidebar.style.display = "block";
            } else {
              sidebar.style.display = "block";
            }

            let trainId = `${schedule.activationId}/${schedule.scheduleId}`;
            DisplayTrainRoute(trainId);

            // create HTML elements to display the train information
            let trainInfo = document.createElement("div");
            trainInfo.classList.add("train-info");

            let location = document.createElement("p");
            location.innerText = `Location: ${lastUpdate.location}`;
            trainInfo.appendChild(location);

            let tiploc = document.createElement("p");
            tiploc.innerText = `Tiploc: ${lastUpdate.tiploc}`;
            trainInfo.appendChild(tiploc);

            let eventType = document.createElement("p");
            eventType.innerText = `Event Type: ${lastUpdate.eventType}`;
            trainInfo.appendChild(eventType);

            let planned = document.createElement("p");
            planned.innerText = `Planned: ${lastUpdate.planned}`;
            trainInfo.appendChild(planned);

            let actual = document.createElement("p");
            actual.innerText = `Actual: ${lastUpdate.actual}`;
            trainInfo.appendChild(actual);

          
            // add the train information to the sidebar
            sidebar.innerHTML = "";
            sidebar.appendChild(trainInfo);
          });
        }
      }
    })
    .catch((err) => console.log("Error: " + err));
}
    

      function DisplayTrainRoute(trainId){
        getData(api_trainschedule + "/" + trainId)
          .then((json) => {
            currentTrainRoute = json
            for (const station of json){
              if(station.latLong){
                const lat = station.latLong.latitude
                const long = station.latLong.longitude
                L.marker([lat, long], {icon: blueIcon}).addTo(map).on("click", function(e){
                             let sidebar = document.getElementById("sidebar")
                if (sidebar.style.display === "block") {
                  sidebar.style.display = "none"
                }
                else {
                  sidebar.style.display = "block"
                }
              });
              }
            }
          })
          .catch(err => console.log("Error: " + err));
      }

      let api_schedule = "http://localhost:3000/api/schedule";
      let api_trainschedule = "http://localhost:3000/api/trainschedule";
      let api_livetrain = "http://localhost:3000/api/livetrain";
      let displayList = [];

      getData(api_schedule)
        .then((json) => {
          for (let schedule of json){
            DisplayLastLocation(schedule)
          }
        })
        .catch(err => console.log("Error: " + err));