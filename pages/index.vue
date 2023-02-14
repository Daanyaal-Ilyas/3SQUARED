<template>
    <header>
        <!-- this is the navbar -->
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>


    <div id="map-container">
        <div id="sidebar">
            <h1>Train Information</h1>
            <p> Schdeule</p>
            <p> Consist</p>
            <p> Notes</p>
            

        </div>

        <!-- this is the map -->
        <div id="leafletmap"></div>
        <p v-for="s in schedule">{{ s }}</p>
    </div>
    <!-- this is the footer -->
    <footer>
        <p>Copyright &copy; 2023 3Squared</p>
    </footer>

</template>

<script setup lang="ts">

import { config } from 'process';
import moment from "moment";
import tiplocCodes from "public/tiploc.js";
import fs from 'fs';

const date = moment().format("YYYY-MM-DD");


useHead({
    title: "3Squared",
    link: [
        {
            rel: "stylesheet",
            integrity: "sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=",
            href: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css",
            crossorigin: "",
        },
    ],
    script: [
        {
            src: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",
            integrity: "sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=",
            crossorigin: "",
        },
        {
            src: "/leafletmap.js",
            body: true,
        },
    ],
});

const tiplocCodeString = tiplocCodes.join(",");
const url = `https://traindata-stag-api.railsmart.io/api/trains/tiploc/${tiplocCodeString}/${date} 00:00:00/${date} 23:59:59`;


const { data: schedule } = await useFetch(url, {
  headers: {
    "X-ApiVersion": "1",
    "X-ApiKey": useRuntimeConfig().apiKey,
  },
});


fetch(url, {
  headers: {
    "X-ApiVersion": "1",
    "X-ApiKey": useRuntimeConfig().apiKey,
  },
})
.then(response => response.json())
.then(data => {
  data.forEach((trainData: any) => {
    if (fs.existsSync('api_response.json')) {
      fs.readFile('api_response.json', 'utf8', (err, contents) => {
        if (err) throw err;
        if (!contents.includes(JSON.stringify(trainData))) {
          fs.appendFile('api_response.json', JSON.stringify(trainData) + '\n', 'utf8', (err: Error | null) => {
            if (err) throw err;
            console.log('The data has been saved!');
          });
        }
      });
    } else {
      fs.appendFile('api_response.json', JSON.stringify(trainData) + '\n', 'utf8', (err: Error | null) => {
        if (err) throw err;
        console.log('The data has been saved!');
      });
    }
  });
})
.catch(error => console.error(error));





</script>

<style scoped>

footer {

    background-color: #f9f9f9;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #000;
    font-size: 1.2em;
    font-family: Arial, sans-serif;
    color: #333;
}
/*test */

/*Sidebar*/ 
#sidebar {
    width: 200px;
    background-color: #e6f0f5;
    float: left;
    padding-left: 20px;
    height: 500px;
    border-right: 4px solid rgb(255, 255, 255);
    display: none;
}

/*map*/ 
#leafletmap {
    height: 500px;
    width: calc(100%-100px);
    float: center;
    padding-left: 20px;
    
}

/*nav*/ 
nav {
    background-color: #f0f5f5;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #3282b8;
    width: 100%;
}

nav a {
    color: #3282b8;
    text-decoration: none;
    font-size: 1.4em;
    margin-right: 20px;
    position: relative;
    transition: all 0.3s ease-in-out;
}

nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

nav li {
    margin: 0 10px;
}


nav a:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #3282b8;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
}

nav a:hover:before {
    transform: scaleX(1);
    transform-origin: left;
}
</style>