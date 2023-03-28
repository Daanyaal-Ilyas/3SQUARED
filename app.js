import express, { json } from 'express';
import fetch from 'node-fetch';
const app = express();

app.use(express.static("./public"));

app.use(json())

const PORT = process.env.PORT || 3000;

async function GetSchedule(date) {
    
    //Check if database holds todays schedule
    const url = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/LEEDS,NEWHVTJ,CAMBDGE,CREWEMD,GTWK,WLSDEUT,HLWY236,LOWFRMT,WLSDRMT,LINCLNC,GLGC,CARLILE,MOSEUPY,KNGX,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/${date} 00:00:00/${date} 23:59:59`;
    const options = {
        method: 'GET',
        headers: {
            'X-ApiVersion': "1",
            'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
        }
    };
    const apiResp = await fetch(url, options);
    const json = await apiResp.json();

    return json
}

app.get("/api/schedule/:date", async function (req, resp) {
    var dateParam = req.params.date;

    let schedule = await GetSchedule(dateParam)

    let schedule_filtered = [];

    schedule.forEach(element => {
        if(!element.cancelled && element.actualArrival && !element.shouldHaveDepartedException){
            schedule_filtered.push(element)
        }
    });

    resp.send(schedule_filtered)
})

app.get("/api/trainschedule/:activationId/:scheduleId", async function (req, resp) {

    //Check if database holds todays train schedules

    const url = `https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${req.params.activationId}/${req.params.scheduleId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-ApiVersion': "1",
            'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
        }
    };
    const apiResp2 = await fetch(url, options);
    const json = await apiResp2.json();

    // Return the original response from the first API call
    resp.send(json)
})

app.get("/api/livetrain/:activationId/:scheduleId", async function (req, resp) {

    const url = `https://traindata-stag-api.railsmart.io/api/ifmtrains/movement/${req.params.activationId}/${req.params.scheduleId}`
    const options = {
        method: 'GET',
        headers: {
            'X-ApiVersion': "1",
            'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
        }
    };
    const apiResp = await fetch(url, options);
    const json = await apiResp.json();

    resp.json(json)
})



app.listen(PORT, () => console.log(`App listening at port ${PORT}`));