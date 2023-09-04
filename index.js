var express = require("express");
const port = 8000;
var app = express();
const router = require('./router/router');
const bodyParser = require('body-parser');
const path = require("path");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.set("views", "views");

app.use(
    express.static(path.join(__dirname, "public"), {
        setHeaders: (res, path) => {
            if(path.endsWith(".css")) {
                res.setHeader("Content-Type", "text/css");
            } else if (path.endsWith(".js")) {
                res.setHeader("Content-type", "application/javascript");
            }
        },
    })
);

app.use(router);

app.listen(port,() =>{
    console.log("server berjalan ");
});