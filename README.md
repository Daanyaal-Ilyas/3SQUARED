# Demo Site for API Calls

Node / express used for a basic webserver to enable fetch calls to an API.

The static files are stored in the public folder.

This is configured in the app.js with:

```app.use(express.static("./public"));```

# Set up in the Docker file

To build docker run:

```
docker build . -t mustbebuilt/node-web-app
docker run -p 49160:3000 -v C:/Users/student/Desktop/myRepos/node-express-static-for-fetch-api/:/usr/src/app --name "fetchapinodeexpress" mustbebuilt/node-web-app 
```