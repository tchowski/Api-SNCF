const express = require("express");
const moment = require('moment');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
const URL = "https://api.navitia.io/v1/coverage/fr-idf/"
const TOKEN = "6f5ff13d-2e7e-4bfb-9d12-e29ecfcc7da5"
const request = require("request-json");
const client = request.createClient(URL);
client.setBasicAuth(TOKEN);
const arriverGDL = "stop_area:OIF:SA:8768600"
const departMelun = "stop_area:OIF:SA:8768200"
const heuredepart = "20181028T133000"

app.use(bodyParser.json());

app.get('/', (req, res) => {
    client.get('journeys' + '?' + 'to=' + arriverGDL + '&' + 'from=' + departMelun + '&' + 'datetime_represents=departure' + '&' + heuredepart + '&').then(result => {
        res.send(result.body.journeys);
    }).catch(error => {
        console.log(error);
    });
});

app.listen(PORT, function () {
    console.log('App listening on port 3000!');
})