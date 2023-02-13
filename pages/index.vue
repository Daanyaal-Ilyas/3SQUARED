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
    <!-- this is the map -->
    <p>Map</p>
    <div id="leafletmap"></div>
    <p v-for="s in schedule">{{ s }}</p>
</template>

<script setup lang="ts">

import { config } from 'process';
import moment from "moment";
 var date = moment().format("YYYY-MM-DD");


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

const url = 'https://traindata-stag-api.railsmart.io/api/trains/tiploc/AYLS302AYLS792,AYLSVJN,AYLSPWY,WHATFHH,AYLSWAD,AYLESFD,AYLERSD,ALSHAM,AYSHMS,AYNHOJ,AACHEN,ABHLJN,ABHL811,ABHLTB,ALERTNJ,ALERTN4,ALLGARC,ALLGREV,ALNGEJN,ALLGFHH,ALNGNJN,ALNGJN,AYRRWRD/' + date + ' 00:00:00/' + date + ' 23:59:59'



const { data: schedule } = await useFetch(url, {
    headers: {
        "X-ApiVersion": "1",
        "X-ApiKey": useRuntimeConfig().apiKey,
    },
});


</script>

<style scoped>
#leafletmap {
    height: 500px;
}

nav {
    background-color: #fff;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #000;
    width: 100%;
}

nav a {
    color: #333;
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
    background-color: #333;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease-in-out;
}

nav a:hover:before {
    transform: scaleX(1);
    transform-origin: left;
}
</style>