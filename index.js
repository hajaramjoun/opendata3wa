
require("dotenv").config();
const express = require('express');
const port = 8080;
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.set('view engine', 'pug');
app.set('views', './views')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/routes")(app);
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`, { useNewUrlParser: true })
// mongoose.connect('mongodb://data:&aqw&AQW1@ds245132.mlab.com:45132/data', { useNewUrlParser: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`vous etes connecter sur lacalhost /8080`)
        })
    });
