<template>

<p>Map</p>
<div id="leafletmap"></div>
<p v-for="s in schedule">{{ s }}</p>


</template>

<script setup lang="ts">
import { config } from 'process';
import moment from "moment";
 var date = moment().format("YYYY-MM-DD");

useHead({
    title: '3Squared',
    link: [
        {
            rel: 'stylesheet',
            integrity: 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=',
            href: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css',
            crossorigin: ''
        }
    ],
    script: [
        {
            src: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js',
            integrity: 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=',
            crossorigin: '',
        },
        {
            src: '/leafletmap.js',
            body: true
        }
    ]
})

const url = 'https://traindata-stag-api.railsmart.io/api/trains/tiploc/CREWEMD,WLSDEUT,LOWFRMT,WLSDRMT,CARLILE,MOSEUPY,STAFFRD,DONCIGB,THMSLGB,FLXSNGB/' + date + ' 00:00:00/' + date + ' 23:59:59'

const { data: schedule } = await useFetch(
    url, {
    headers: {
        'X-ApiVersion': '1',
        'X-ApiKey': useRuntimeConfig().apiKey
    }
})

</script>

<style scoped>
    #leafletmap { height: 500px; }
</style>