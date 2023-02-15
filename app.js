import express, { json } from 'express';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();

app.use(express.static("./public"));

app.use(json())

const PORT = process.env.PORT || 3000;

let schedule = await GetSchedule()
fs.writeFile("schedule.json", JSON.stringify(schedule), (function (err) {
    
}))

async function GetSchedule() {
    
    //Check if database holds todays schedule

    const url = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-15 00:00:00/2023-02-15 23:59:59`;
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

app.get("/api/schedule", async function (req, resp) {
    let schedule = await GetSchedule()
    resp.send(sc)
})

app.get("/api/trainschedule", async function (req, resp) {

    //Check if database holds todays train schedules

    let schedule = await GetSchedule()
    let trainSchedules = []

    for (const item of schedule) {
        const { activationId, scheduleId } = item;
        const url = `https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activationId}/${scheduleId}`;
        const options = {
            method: 'GET',
            headers: {
                'X-ApiVersion': "1",
                'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
            }
        };
        const apiResp2 = await fetch(url, options);
        const json = await apiResp2.json();
    
        trainSchedules.push(json)
    }

    // Return the original response from the first API call
    resp.send(trainSchedules)
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