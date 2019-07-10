'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// var lat = 0.0;
// var long = 0.0;

const app = express();
app.use(cors());

app.get('/location', searchToLatLng);
//this is whatever the user searched for
function searchToLatLng(request, response) {
  const locationName = request.query.data; //location user entered
  //google maps api 
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${GEOCODE_API_KEY}`;
  superagent.get(url) //superagent api request
    .then (result => { //promise on async
      //save latlong for later
      console.log('result.body.results[0] ------------->:',result.body.results[0]);
      // lat = result.body.results[0].geometry.location.lat;
      // long = result.body.results[0].geometry.location.lng;

      let location = { //object
        search_query: locationName,
        formatted_query : result.body.results[0].formatted_address,
        latitude : result.body.results[0].geometry.location.lat,
        longitude : result.body.results[0].geometry.location.lng
      }

      response.send(location); //send to user
    }).catch(e => {
      //if errors
      console.error(e);
      response.status(500).send('status 500: things are wrong.');
    })
}

//superagent path for searching the weather with an API
app.get('/weather', searchWeather);
//weather constructor
function Weather(forecast) {
  this.forecast = forecast.summary;
  // console.log(forecast.summary);
  this.time = new Date(forecast.time * 1000 ).toDateString();
}
//function to search the weather
function searchWeather(request, response) {
  //google maps api
  //TODO: remove hardcoded geo tags
  const url = `https://api.darksky.net/forecast/${WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  //results array
  //let weatherDetails = [];
  superagent.get(url) //superagent api request
    .then (result => { //promise on async
      // console.log('result.body.daily.data:',result.body.daily.data);
      // result.body.daily.data.forEach(element => {
      //   // console.log('element:',element);
      //   weatherDetails.push(
      //     new Weather(element)
      //   )
      // });

      let weatherDetails = result.body.daily.data.map(function (element){
        return new Weather(element)
      })

      response.send(weatherDetails);
    }).catch(e => {
      //if errors
      console.error(e);
      response.status(500).send('status 500: things are wrong.');
    })
}
//Searchweather ENDS

app.use('*', (request, response) => {
  response.status(500).send('you got to the wrong place.');
})

app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`);
});
