var map = L.map('leafletmap').setView([54, -0.5], 6);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

let api_schedule = "api/schedule"
let api_trainschedule = "api/trainschedule"
let api_livetrain = "api/livetrain"

var earlyIcon = L.icon({
  iconUrl: '/icons/Early.png',
  iconSize: [20, 20],
  popupAnchor: [0, -25]
});
var lateIcon = L.icon({
  iconUrl: '/icons/Late.png',
  iconSize: [20, 20],
  popupAnchor: [0, -25]
});
var futureIcon = L.icon({
  iconUrl: '/icons/Future.png',
  iconSize: [20, 20],
  popupAnchor: [0, -25]
});
var noReportIcon = L.icon({
  iconUrl: '/icons/NoReport.png',
  iconSize: [20, 20],
  popupAnchor: [0, -25]
});
var trainIcon = L.icon({
  iconUrl: '/icons/Train.png',
  iconSize: [40, 35],
  iconAnchor: [20, 30],
  popupAnchor: [0, -30]
});

var datetime;
var datetime_date;
var datetime_time;

var markers = new Array();
var trainMarkers = new Array();

var routeLine = null;

var scheduleJson;
// Array: trainId: schedule | Schedules
var scheduleDict = {};
// Array: trainId: trainSchedule | Train Schedule, do not get directly, use GetTrainSchedule
var trainScheduleDict = {};
// Array: trainId: trainData | Live Train Data, Train Movements
var liveTrainDataDict = {};
// Array: trainId: Array: tiploc: trainData  | Live Train Data, Train Movements, Each holds a Map: tiploc: trainData
var filtered_liveTrainDataDict = {};

var previous_datetime_date = "";

CreateLegend()

function Refresh(datetimeString) {
  var split_datetimeString = datetimeString.split(" ")
  datetime_date = split_datetimeString[0]
  datetime_time = split_datetimeString[1]
  datetime = new Date(datetime_date + " " + datetime_time)

  scheduleDict = {}
  trainScheduleDict = {}
  liveTrainDataDict = {}
  filtered_liveTrainDataDict = {}
  if (routeLine) {
      map.removeLayer(routeLine);
  }

  RemoveAllMarkers()
  RemoveTrainMarkers()

  if(!scheduleJson || previous_datetime_date != datetime_date){
    previous_datetime_date = datetime_date
    getData(api_schedule + "/" + datetime_date)
      .then((json) => {
        scheduleJson = json
        for (let schedule of json) {
          let trainId = `${schedule.activationId}/${schedule.scheduleId}`
          scheduleDict[trainId] = schedule
          DisplayLiveTrainPositions(trainId)
        }
      })
      .catch(err => console.log("Error: " + err))
  }
  else {
    previous_datetime_date = datetime_date
    for (let schedule of scheduleJson) {
      let trainId = `${schedule.activationId}/${schedule.scheduleId}`
      scheduleDict[trainId] = schedule
      DisplayLiveTrainPositions(trainId)
    }
  }
}

async function getData(url) {
  const response = await fetch(url)
  const json = await response.json()
  return json;
}

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

function RemoveAllMarkers() {
    for (let marker of markers){
      map.removeLayer(marker)
    }
    markers = new Array()
}

function RemoveTrainMarkers() {
    for (let marker of trainMarkers){
      map.removeLayer(marker)
    }
    trainMarkers = new Array()
}

function DisplayTrainRoute(trainId) {

  GetTrainSchedule(trainId).then(function (schedule) {
    RemoveAllMarkers()

    const liveSchedule = liveTrainDataDict[trainId]
    const lastUpdate = liveSchedule[liveSchedule.length - 1]
    const trainAtStation = lastUpdate.tiploc
    let isFuture = false
    const latLngs = [];
    // clear existing content in the sidebar
    const sidebar = document.getElementById("sidebar")
    sidebar.innerHTML = `<p>Train UID<br>${scheduleDict[trainId].trainUid}</p>`;
    sidebar.innerHTML += `<p>Departure<br>${schedule[0].location}</p>`;
    sidebar.innerHTML += `<p>Destination<br>${schedule[schedule.length - 1].location}</p>`;

 
    // Add list of stations to sidebar
    var sidebar_timetable = document.createElement("div")
    sidebar_timetable.className = "sidebar_timetable"

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

        var icon;
        var innerText;
        let timeInfo;

        if (!isFuture) {
          const liveData = filtered_liveTrainDataDict[trainId]
          let variation = liveData.get(station.tiploc)?.variation
        
          if (!variation) {
            icon = noReportIcon
            innerText = '<p class="card-text sidebar_p noreport">No Report</p>'
            timeInfo = `No Report<br>`
          } else {
            let variationDate = new Date(date)
            variationDate.setMinutes(date.getMinutes() + variation)
            let plannedDate = FormatDateToHHCOMMAMM(date)
            let actualDate = FormatDateToHHCOMMAMM(variationDate)
            if (variation > 0) {
              icon = lateIcon
              innerText = `<p class="card-text sidebar_p planned">Planned: ${plannedDate}</p><p class="card-text sidebar_p late">Actual: ${actualDate}</p>`
            } else {
              icon = earlyIcon
              innerText = `<p class="card-text sidebar_p planned">Planned: ${plannedDate}</p><p class="card-text sidebar_p earlyontime">Actual: ${actualDate}</p>`
            }
            timeInfo = `Planned: ${plannedDate}<br>Actual: ${actualDate}`
          }

          if(station.tiploc == trainAtStation) isFuture = true
          
        } else {
          icon = futureIcon
          innerText = `<p class="card-text sidebar_p future">Planned: ${FormatDateToHHCOMMAMM(date)}</p>`
          timeInfo = `Planned: ${FormatDateToHHCOMMAMM(date)}`
        }
        if (routeLine) {
          map.removeLayer(routeLine);
        }
        latLngs.push([lat, long]);

        routeLine = L.polyline(latLngs, {color: '#3388ff', weight: 8, opacity: 0.8, dashArray: '7 7',}).addTo(map);

        let marker = L.marker([lat, long], { icon: icon }).addTo(map);
        markers.push(marker);
        BindPopup(marker, station.tiploc,  timeInfo);

        sidebar_timetable.innerHTML += 
        `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${station.location}</h5>
            ${innerText}
          </div>
        </div>
        `

      }
    }
    sidebar.appendChild(sidebar_timetable)
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
      var filteredjson = FilterLiveTrainDataDate(json)
      liveTrainDataDict[trainId] = filteredjson
      filtered_liveTrainDataDict[trainId] = FilterLiveTrainData(filteredjson)
      const lastUpdate = filteredjson[filteredjson.length - 1]
      if (lastUpdate) {
        let schedule = scheduleDict[trainId]
        if (lastUpdate.latLong) {
          if(!(lastUpdate.tiploc == schedule.destinationTiploc)) {
            const lat = lastUpdate.latLong.latitude
            const long = lastUpdate.latLong.longitude
            let marker = L.marker([lat, long], { icon: trainIcon, trainId: trainId });
            marker.addTo(map)
            marker.on('click', function () { OnTrainClicked(trainId) })
            trainMarkers.push(marker)
            BindPopup(marker, scheduleDict[trainId].toc_Name)
          }
        }
      }
    })
    .catch(err => console.log("Error: " + err));  
}

function FilterLiveTrainDataDate(trainData){

  var filtered = new Array()

  if(datetime_time){
    for (let data of trainData){
      if(data.eventType == "DEPARTURE"){
        var departureDate = new Date(data.actualDeparture)
        if(departureDate.getTime() < datetime.getTime()){
          filtered.push(data)
        }
      }
      if(data.eventType == "ARRIVAL" || data.eventType == "DESTINATION"){
        var arrivalData = new Date(data.actualArrival)
        if(arrivalData.getTime() < datetime.getTime()){
          filtered.push(data)
        }
      }
    }
  }
  else{
    return trainData
  }

  return filtered
}

function FilterLiveTrainData(trainData){
  var dict = new Map()

  for (let data of trainData){
    dict.set(data.tiploc, data)
  }

  return dict
}

function BindPopup(element, text, timeInfo = "") {

  element.bindPopup(`<b>${text}</b><br>${timeInfo}`);
  element.on('mouseover', function () {
    this.openPopup();
  })
  element.on('mouseout', function () {
    this.closePopup();
  })
}

const showAllTrainsBtn = document.getElementById("showAllTrainsBtn");

function OnTrainClicked(trainId) {
  let sidebar = document.getElementById("sidebar");
  if (sidebar.dataset.selectedTrainId === trainId) {
    // hide sidebar and reset selectedTrainId
    HideSidebar();
    if (routeLine) {
      map.removeLayer(routeLine);
    }
    RemoveAllMarkers()
    // show all train markers
    map.eachLayer(function(layer) {
      if (layer.options.icon === trainIcon) {
        layer.setOpacity(1);
      }
    });
  } else {
    sidebar.style.display = "block";
    sidebar.dataset.selectedTrainId = trainId;
    DisplayTrainRoute(trainId);
    // hide all train markers except for the selected one
    map.eachLayer(function(layer) {
      if (layer.options.icon === trainIcon && layer.options.trainId !== trainId) {
        layer.setOpacity(0);
      }
    });
  }
}

function HideSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.style.display = "none";
  sidebar.dataset.selectedTrainId = "";
}

function GetCurrentDate(){
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function CreateLegend() {
  const legend = document.getElementById("map-legend");
  const icons = [
    { icon: earlyIcon, description: "Early/On Time" },
    { icon: lateIcon, description: "Late" },
    { icon: futureIcon, description: "Planned" },
    { icon: noReportIcon, description: "No Report" },
    { icon: trainIcon, description: "Train" },
  ];

  for (const item of icons) {
    const iconDiv = document.createElement("div");
    const iconImg = L.DomUtil.create("img");
    iconImg.src = item.icon.options.iconUrl;
    iconImg.style.width = "20px";
    iconImg.style.height = "20px";
    iconDiv.appendChild(iconImg);

    const iconDescription = document.createElement("span");
    iconDescription.textContent = ` ${item.description}`;
    iconDiv.appendChild(iconDescription);

    legend.appendChild(iconDiv);
  }
}