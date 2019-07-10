'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

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


function Weather(forcast, time) {
  this.forcast = forcast;
  this.time = time
}
// eslint-disable-next-line no-unused-vars
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



app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`);
});

