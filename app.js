import express, { json } from 'express';
import fetch from 'node-fetch';


const app = express();



app.use(express.static("./public"));

app.use(json())

const PORT = process.env.PORT || 3000;

app.get("/api", async function(req, resp){
    const url = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-14 00:00:00/2023-02-15 23:59:59`;
    const options = {
        method: 'GET',
        headers: {
            'X-ApiVersion': 1,
            'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
        }
    };
    const apiResp = await fetch(url, options);
    const tiploc = await apiResp.json();

	const trainschedule = [];
    // Loop over the data in the response and make additional API calls for each item
    for (const item of json) {
        const { activationId, scheduleId } = item;
        const url2 = `https://traindata-stag-api.railsmart.io/api/ifmtrains/schedule/${activationId}/${scheduleId}`;
        const options2 = {
            method: 'GET',
            headers: {
                'X-ApiVersion': 1,
                'X-ApiKey': 'AA26F453-D34D-4EFC-9DC8-F63625B67F4A'
            }
        };
        const apiResp2 = await fetch(url2, options2);
        const trainschedules = await apiResp2.json();

		//Add the json2 object to the trainschedule
		trainschedule.push(trainschedules);
    }
	const responseObj = {
        json: tiploc,
        json2: trainschedule
    };
    resp.json(responseObj);
})



app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
