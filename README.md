---------------------------------------------------------------------------------------
Train Tracking App
---------------------------------------------------------------------------------------
This is a Node.js web application for tracking live train data using the 3Squared API.

---------------------------------------------------------------------------------------
Installation
---------------------------------------------------------------------------------------
To install the required dependencies, run the following command:


npm install

This will install all the required modules specified in the package.json file.
-----------------------------------------------------------------------------------
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

This will start the server at http://localhost:3000/
You can also View the deployment from https://trainmaps.azurewebsites.net/
------------------------------------------------------------------------------------

Cass | Old Github
https://github.com/CassHodgkiss/3SQUARED/tree/test_cass
