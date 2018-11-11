const express = require("express");
const moment = require('moment');
const path = require('path');
const twig = require('twig');
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

app.set('views', './views')
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.use(bodyParser.json());

app.use('/vendor', express.static('views/vendor'));
app.use('/js', express.static('views/js'));
app.use('/css', express.static('views/css'));
app.use('/img', express.static('views/img'));


var heures = {
    dateDemander: "",
    dateArrivee: "",
    dateDepart: ""
};

app.get("/", (req, res) => {
    testa = () => {
        client.get('journeys' + '?' + 'to=' + arriverGDL + '&' + 'from=' + departMelun + '&' + 'datetime_represents=departure' + '&' + heuredepart + '&').then(function (result) {
            var departure = result.body.journeys[0].departure_date_time;
            var arrival = result.body.journeys[0].arrival_date_time;
            heureDemander = result.body.journeys[0].requested_date_time;
            heures.dateDepart = moment(departure).format("LLLL");
            heures.dateArrivee = moment(arrival).format("LLLL");
            heures.dateDemander = moment(heureDemander).format("LLLL");
            res.render('index', {
                arriver: heures.dateArrivee,
                depart: heures.dateDepart
            });
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