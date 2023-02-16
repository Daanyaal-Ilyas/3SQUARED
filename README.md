---------------------------------------------------------------------------------------
Train Tracking App
---------------------------------------------------------------------------------------
This is a Node.js web application for tracking live train data using the RailSmart API.

-------------------------------------------------------------------------------
Installation
-------------------------------------------------------------------------------
To install the required dependencies, run the following command:


npm install

This will install all the required modules specified in the package.json file.

In app.js Make your you set the API Key

For Example 
        headers: {
            'X-ApiVersion': "1",
            'X-ApiKey': ''  <------------------ Add your API Key in the ''
        }
-----------------------------------------------------------------------------------
Usage
-----------------------------------------------------------------------------------
To start the application, run the following command:

node app

This will start the server at http://localhost:3000/.

You can then access the web application by opening your web browser and navigating to http://localhost:3000/.

API data for trains  at http://localhost:3000/api/livetrain
API data for Train schedule at http://localhost:3000/api/trainschedule
API  Schedules (TIPLocs) at http://localhost:3000/api/schedule
