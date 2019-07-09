'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  try {
    // console.log('req:',request.query.location)
    const locationData = searchToLatLng(request.query.location);
    //get the   
    response.send(locationData)
  } catch(e){
    console.log('error:', e)

    //catch the error
    response.status(500).send('status 500: things are wrong.');
  }
  // response.send(require('./data/geo.json'));
} )

app.use('*', (request, response) => {
  response.send('you got to the wrong place.');
})
function Location (locationName, formatted_address,lat,lng ){
  this.search_query= locationName,
  this.formatted_query= formatted_address,
  this.latitude = lat,
  this.longitude = lng
}
//this is whatever the user searched for 
function searchToLatLng (locationName){
  console.log('locationName', locationName);
  const geoData = require('./data/geo.json');
  const location = new Location(
    locationName,
    geoData.results[0].formatted_address,
    geoData.results[0].geometry.location.lat,
    geoData.results[0].geometry.location.lng
    )
  // const location = {
  //   search_query: locationName,
  //   formatted_query: geoData.results[0].formatted_address,
  //   latitude: geoData.results[0].geometry.location.lat,
  //   longitude: geoData.results[0].geometry.location.lng
  // }
  return location;
}


app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`);
});

