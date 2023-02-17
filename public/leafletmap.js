var map = L.map('leafletmap').setView([54, -0.5], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
    sidebar.innerHTML = `<h3>Train Info: ${scheduleDict[trainId].toc_Name}</h3><ul>`
    for (const station of schedule) {
      if (station.latLong) {
        const lat = station.latLong.latitude
        const long = station.latLong.longitude
        if(!isFuture){
          const liveData = filtered_liveTrainDataDict[trainId]
          let variation = liveData.get(station.tiploc)?.variation
          if(!variation){
            markers.push(L.marker([lat, long], { icon: noReportIcon }).addTo(map))
            sidebar.innerHTML += `<li>${station.location} <span style="color:blue;">(No Report)</span></li>`
          } else {
            if(variation > 0) {
              markers.push(L.marker([lat, long], { icon: lateIcon }).addTo(map))
              sidebar.innerHTML += `<li>${station.location} <span style="color:red;">(${variation} minutes late)</span></li>`
            }
            else if(variation < 0){
              markers.push(L.marker([lat, long], { icon: earlyIcon }).addTo(map))
              sidebar.innerHTML += `<li>${station.location} <span style="color:green;">(${Math.abs(variation)} minutes early)</span></li>`
            }
          }
        } else {
          markers.push(L.marker([lat, long], { icon: futureIcon }).addTo(map))
          sidebar.innerHTML += `<li>${station.location} - Planned arrival : ${lastUpdate.plannedArrival}</li>`
        }
      }
      if(station.tiploc == trainAtStation) isFuture = true
    }
    sidebar.innerHTML += `</ul>`
  })
  .catch(err => console.log("Error: " + err));
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