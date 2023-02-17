var map = L.map('leafletmap').setView([54, -0.5], 6);


L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
}).addTo(map);
L.tileLayer('https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailWayMap</a>'
}).addTo(map);



var markers = new Array()

// Array: trainId: schedule | Schedules, do not get directly, use GetTrainSchedule
var scheduleDict = {}
// Array: trainId: trainSchedule | Train Schedule
var trainScheduleDict = {}
// Array: trainId: trainData | Live Train Data, Train Movements
var liveTrainDataDict = {}
// Array: trainId: Array: tiploc: trainData  | Live Train Data, Train Movements, Each holds a Map: tiploc: trainData
var filtered_liveTrainDataDict = {}


function GetTrainSchedule(trainId){
  return new Promise(function(_callback){
    if(trainId in trainScheduleDict){
      _callback(trainScheduleDict[trainId])
    } else {
      getData(api_trainschedule + "/" + trainId)
        .then((json) => {
          trainScheduleDict[trainId] = json
          _callback(trainScheduleDict[trainId])
        })
        .catch(err => console.log("Error: " + err));
    }
  })
}

function DisplayTrainRoute(trainId) {
  GetTrainSchedule(trainId).then(function (schedule) {
    for (let marker of markers){
      map.removeLayer(marker)
    }

    const liveSchedule = liveTrainDataDict[trainId]
    const lastUpdate = liveSchedule[liveSchedule.length - 1]
    const trainAtStation = lastUpdate.tiploc
    let isFuture = false

    // clear existing content in the sidebar
    const sidebar = document.getElementById("sidebar")
    sidebar.innerHTML = `<p>Train Info: ${scheduleDict[trainId].toc_Name}</p>`;
    sidebar.innerHTML += `<p>Departure Location: ${schedule[0].location}</p>`;
    sidebar.innerHTML += `<p>Destination Location: ${schedule[schedule.length - 1].location}</p>`;

    //// Calculate progress along the route as a percentage
    //const totalStations = schedule.length;
    //const passedStations = schedule.filter(station => {
    //  const index = liveSchedule.findIndex(s => s.tiploc === station.tiploc);
    //  return index !== -1 && index < liveSchedule.length - 1;
    //}).length;
    //const progress = Math.round((passedStations / totalStations) * 100);

    //// Add progress bar to sidebar
    //sidebar.innerHTML += `<div class="progress-bar"><div class="progress" style="width:${progress}%"></div></div>`;

    // Add list of stations to sidebar
    sidebar.innerHTML += `<div>`;

    for (const station of schedule) {
      if (station.latLong) {
        const lat = station.latLong.latitude
        const long = station.latLong.longitude
        var date;
        if(station.pass){
          date = ParseHHMMDate(station.pass)
        }
        else if(station.arrival){
          date = ParseHHMMDate(station.arrival)
        }
        else{
          date = ParseHHMMDate(station.departure)
        }
        if(!isFuture){
          const liveData = filtered_liveTrainDataDict[trainId]
          let variation = liveData.get(station.tiploc)?.variation
          
          if(!variation){
            markers.push(L.marker([lat, long], { icon: noReportIcon }).addTo(map))
            sidebar.innerHTML +=
            `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${station.location}</h5>
                <p class="card-text">No Report</p>
              </div>
            </div>
            `
          } else {

            let variationDate = new Date(date)
            variationDate.setMinutes(date.getMinutes() + variation)
            let dateString = FormatDateToHHCOMMAMM(date) + " | " + FormatDateToHHCOMMAMM(variationDate)

            if(variation > 0) {
              markers.push(L.marker([lat, long], { icon: lateIcon }).addTo(map))
              sidebar.innerHTML += 
              `
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${station.location}</h5>
                  <p class="card-text">${dateString}</p>
                </div>
              </div>
              ` 
            }
            else if(variation < 0){
              markers.push(L.marker([lat, long], { icon: earlyIcon }).addTo(map))
              sidebar.innerHTML += 
              `
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${station.location}</h5>
                  <p class="card-text">${dateString}</p>
                </div>
              </div>
              `
            }
          }
        } else {
            markers.push(L.marker([lat, long], { icon: futureIcon }).addTo(map))

            sidebar.innerHTML += 
            `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${station.location}</h5>
                <p class="card-text">Planned arrival ${FormatDateToHHCOMMAMM(date)}</p>
              </div>
            </div>
              `
        }
      }
      if(station.tiploc == trainAtStation) isFuture = true
    }

    sidebar.innerHTML += `</div>`
  })
}

function ParseHHMMDate(dateString){
  const hours = parseInt(dateString.substring(0, 2));
  const minutes = parseInt(dateString.substring(2));
  let date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

function FormatDateToHHCOMMAMM(date){
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
  let mins = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  return hours + ":" + mins
}


//display last location
function DisplayLiveTrainPositions(trainId) {
  getData(api_livetrain + "/" + trainId)
    .then((json) => {
      liveTrainDataDict[trainId] = json
      filtered_liveTrainDataDict[trainId] = FilterLiveTrainData(json)
      const lastUpdate = json[json.length - 1]
      if (lastUpdate) {
        let schedule = scheduleDict[trainId]
        if (lastUpdate.latLong) {
          if(!(lastUpdate.tiploc == schedule.destinationTiploc)) {
            const lat = lastUpdate.latLong.latitude
            const long = lastUpdate.latLong.longitude
            L.marker([lat, long], { icon: trainIcon }).addTo(map).on('click', function() { OnTrainClicked(trainId) })
          }
        }
      }
    })
    .catch(err => console.log("Error: " + err));  
}

function FilterLiveTrainData(trainData){
  var dict = new Map()
  for (let data of trainData){
    dict.set(data.tiploc, data)
  }
  return dict
}

function OnTrainClicked(trainId){
  let sidebar = document.getElementById("sidebar")
  if (sidebar.style.display === "none") {
    sidebar.style.display = "block"
  } else {
    sidebar.style.display = "block"
  }
  DisplayTrainRoute(trainId)
}

var earlyIcon = L.icon({
  iconUrl: '/icons/Early.png',
  iconSize: [20, 20],
});
var lateIcon = L.icon({
  iconUrl: '/icons/Late.png',
  iconSize: [20, 20],
});
var futureIcon = L.icon({
  iconUrl: '/icons/Future.png',
  iconSize: [20, 20],
});
var noReportIcon = L.icon({
  iconUrl: '/icons/NoReport.png',
  iconSize: [20, 20],
});
var trainIcon = L.icon({
  iconUrl: '/icons/Train.png',
  iconSize: [50, 50],
});

async function getData(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}



//Display Trains

let api_schedule = "http://localhost:3000/api/schedule";
let api_trainschedule = "http://localhost:3000/api/trainschedule";
let api_livetrain = "http://localhost:3000/api/livetrain";

getData(api_schedule)
  .then((json) => {
    for (let schedule of json) {
      let trainId = `${schedule.activationId}/${schedule.scheduleId}`
      scheduleDict[trainId] = schedule
      DisplayLiveTrainPositions(trainId)
    }
  })
  .catch(err => console.log("Error: " + err));