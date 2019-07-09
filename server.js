'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  // response.send('Hello world, you are on the location path');
  //requiring from a filepath

  try {
    const locationData = searchToLatLng(request.query.data);
    //get the query
    console.log(request.query.data);
  } catch(e){
    //catch the error
    response.status(500).send('status 500: things are wrong.');
  }
  // response.send(require('./data/geo.json'));
} )

app.use('*', (request, response) => {
  response.send('you got to the wrong place.');
})

//this is whatever the user searched for 
function searchToLatLng (locationName){
  const geoData = require('./data/geo.json');
  const location = {
    search_query: locationName,
    formatted_query: geoData.results[0].formatted_address,
    latitude: geoData.results[0].geometry.location.lat,
    longitude: geoData.results[0].geometry.location.lng
  }
  return location;
}


app.listen(PORT, () => {
  console.log(`app is up on port ${PORT}`);
});

