const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const key = "5505518a930b5cb68ed434f71806b442"

const botaoTeste = '<form action="/home" method="post"><button style="margin-top:15px" class="btn btn-outline-success " type="submit">Back</button></form>';
const puxaCss = '<p><link rel="stylesheet" type="text/css" href="/css/styles.css" /></p>';
const searchForm = '<form style="margin:auto;" class="form-inline" action="/" method="post"><br><input style="width:200px;" class="form-control mr-sm-2" placeholder="Procurar outra cidade" name="cityName"><button style="margin:10px" class="btn btn-outline-success my-2 my-sm-0" type="submit">Go</button></form>';

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/home", function(req, res) {
  res.sendFile(__dirname + "/fakeIndex.html")
})

app.post("/", function(req, res) {

  console.log(req.body.cityName);
  const cidade = req.body.cityName;

  const futuroUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cidade + "&appid=" + key + "&units=metric&lang=pt_br";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cidade + "&appid=" + key + "&units=metric&lang=pt_br";
  https.get(url, function(response) {
    var codigo = response.statusCode;
    console.log(codigo);

    if (codigo === 200) {
      res.write("<title>Será que ta frio em " + cidade + "?</title>");
      res.write(puxaCss);
      res.write('<body style="background-color:#121212;"></body>')
      res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
      res.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">');
      res.write('<meta charset="utf-8">');
      res.write('<nav style="margin:auto; background-color:#121212;" class="navbar navbar-light">' + botaoTeste + searchForm + "</nav>")
      https.get(url, function(response) {
        response.on("data", function(data) {
          const weatherData = JSON.parse(data);
          const weatherIcon = weatherData.weather[0].icon + "@2x.png";
          const iconLocation = "http://openweathermap.org/img/wn/" + weatherIcon;
          res.write("<div style='background-color:#171717;'><br><h1>Em " + weatherData.name + " faz " + weatherData.main.temp + " graus. </h1>");
          res.write("<p style='font-size:20px'>O clima é " + weatherData.weather[0].description + ".<br></p>");
          res.write("<p style='font-size:20px'>A sensação térmica é de " + weatherData.main.feels_like + " graus.</p><br></div>");
          // res.write("<img src=" + iconLocation + "><br>");
        });

        https.get(futuroUrl, function(response) {
          response.on("data", function(data) {
            const futureWeather = JSON.parse(data);
            var datas = [];
            var climas = [];
            var i = 0;
            while (i < 40) {
              datas.push(futureWeather.list[i].dt_txt);
              climas.push(futureWeather.list[i].main.temp)
              i++;
            }
            var k = 0;
            res.write("<div style='background-color:#121212'><br><h2>Nos próximos dias:</h2><br>")
            res.write("<table style='text-align:center; max-width:60%; margin:auto;' class='table'><thead><tr><th scope='col'>Dia / Hora</th><th scope='col'>Graus (°)</th></tr></thead>");
            res.write("<tbody>");
            while (k < 40) {
              res.write("<tr><td>" + datas[k] + " </td><td> " + climas[k] + "</td></tr>");
              k++;
            }
            // res.write("</div><div style=background-color:#ededed><br>" + botaoTeste + "</div><br>");
            // res.write(botaoTeste);
            res.write('</div>');
            res.send();
          })
        })
      })
    } else {
      res.sendFile(__dirname + "/fakeIndex.html");
    }
  })
})



app.listen(process.env.PORT || 3000, function() {
  console.log("3000 NA ESCUTA");
})
