'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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

//TODO: superagent path for searching the weather with an API
app.get('/weather', searchWeather);
//weather constructor
function Weather(forcast, time) {
  this.forcast = forcast;
  this.time = time
}
//function to search the weather
function searchWeather(request, response) {
  const locationName = request.query.data; //location user entered
  console.log('location name: ', locationName);
  //google maps api 
  const url = `https://api.darksky.net/forecast/${WEATHER_API_KEY}/37.8267,-122.4233`;

  superagent.get(url) //superagent api request
    .then (result => { //promise on async

      console.log('result: ', result);

      // let location = { //object
      //   search_query: locationName,
      //   formatted_query : result.body.results[0].formatted_address,
      //   latitude : result.body.results[0].geometry.location.lat,
      //   longitude : result.body.results[0].geometry.location.lng
      // }
      // response.send(location); //send to user
    }).catch(e => {
      //if errors
      console.error(e);
      response.status(500).send('status 500: things are wrong.');
    })
}
//THE COPY ENDS

//the function calls

function searchWeather(location) {
  //currently grabbing from a json file.
  const weatherData = require('./data/darksky.json');
  let res = []
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  weatherData.daily.data.forEach((el) => {
    //https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
    let utcSeconds = el.time;
    let date = new Date(0);
    date.setUTCSeconds(utcSeconds);
    console.log(date);
    //can also use .toDateString()
    let weather = new Weather(el.summary, date.toLocaleDateString('en-US', options));
    res.push(weather);
  });
  return res;
}
//end the function calls




//TODO: delete this later
app.get('/weather', (req, res) => {
  try {
    // console.log(req.query.location)
    const weather = searchWeather(req.query.location)
    res.send(weather);
    //Weather(forcast,time)
  } catch (e) {
    console.log('error:', e);
    res.status(500).send('status 500: things are wrong.');
  }
})

app.use('*', (request, response) => {
  response.status(500).send('you got to the wrong place.');
})

function Location(locationName, formatted_address, lat, lng) {
  this.search_query = locationName,
  this.formatted_query = formatted_address,
  this.latitude = lat,
  this.longitude = lng
}






app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`);
});

