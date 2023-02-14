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
const json = await apiResp.json();
resp.json(json)

})


app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
