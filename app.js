const express = require("express");
const moment = require('moment');
const path = require('path');
moment.locale('fr');
const app = express();
const bodyParser = require("body-parser");
const PORT = 5700;
const URL = "https://api.navitia.io/v1/coverage/fr-idf/"
const TOKEN = "6f5ff13d-2e7e-4bfb-9d12-e29ecfcc7da5"
const request = require("request-json");
const client = request.createClient(URL);
client.setBasicAuth(TOKEN);
const arriverGDL = "stop_area:OIF:SA:8768600"
const departMelun = "stop_area:OIF:SA:8768200"
heureDepartMoment = moment().format("YYYYMMDD" + "T" + "HHmmss");
const heuredepart = heureDepartMoment

app.use(bodyParser.json());

let heures = {
    dateDemander: "",
    dateArrivee: "",
    dateDepart: ""
}

app.get("/", (req, res) => {
    testa = () => {
        client.get('journeys' + '?' + 'to=' + arriverGDL + '&' + 'from=' + departMelun + '&' + 'datetime_represents=departure' + '&' + heuredepart + '&').then(function (result) {
             console.log(result.body.journeys[0])
            let departure = result.body.journeys[0].departure_date_time;
            let arrival = result.body.journeys[0].arrival_date_time;
            heureDemander = result.body.journeys[0].requested_date_time;
            heures.dateDepart = moment(departure).format("LLLL");
            heures.dateArrivee = moment(arrival).format("LLLL");
            heures.dateDemander = moment(heureDemander).format("LLLL");
            res.send("<p style=\"text-align: center;\"> Requête demandée à: " + heures.dateDemander + "</p> <br> <p style=\"text-align: center;\"> Le prochain train part à: " + heures.dateDepart + "</p> <br> <p style=\"text-align: center;\" > L'heure d'arrivée est prévue à: " + heures.dateArrivee + "</p>")
            return heures

        }).catch(error => {
            console.log(error);
        });
    }
    var test = new Promise((resolve, reject) => {
        resolve(testa());
    });
});

app.get('/GDL', (req, res) => {

    client.get('journeys' + '?' + 'to=' + departMelun + '&' + 'from=' + arriverGDL + '&' + 'datetime_represents=departure' + '&' + heuredepart + '&').then(result => {
        res.send(result.body.journeys);
    }).catch(error => {
        console.log(error);
    });
})

app.listen(PORT, function () {
    console.log('App listening on port ' + PORT + ' !');
})