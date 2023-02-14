import express, { json } from 'express';
import fetch from 'node-fetch';

const app = express();

app.use(express.static('./public'));
app.use(json());

const PORT = process.env.PORT || 3000;

app.get('/api', async function(req, resp) {
  const url = 'https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/2023-02-14 00:00:00/2023-02-15 23:59:59';
  const options = {
    method: 'GET',
    headers: {
      'X-ApiVersion': 1,
      'X-ApiKey': '55A53E2D-945C-4E79-8719-A25300812A41',
    }
  };
  try {
    const apiResp = await fetch(url, options);
    const json = await apiResp.json();
    resp.json(json);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ error: 'Internal server error TipLoc' });
  }
});


app.listen(PORT, () => console.log(`App listening at port ${PORT}`));