const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const pug = require('pug');
const key = require('./key');
const request = require('request');
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res)=>{
    res.render('index')
})

app.post('/', (req, res)=>{
    let query = req.body.city;
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=imperial&appid=' + key;
    request(url, (error, response, body)=>{
        let weather = JSON.parse(body);
        if(weather.cod !== 200){
            let cod = weather.cod;
            let message = weather.message;
            res.render('error', {cod: cod, message: message});
        } else {
            let name = weather.name;
            let mainTemp = Math.round(weather.main.temp);
            let weatherDescription = weather.weather[0].description;
            res.render('results', {name: name, mainTemp: mainTemp, weatherDescription: weatherDescription});
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Serving on PORT:${PORT}`)
})
