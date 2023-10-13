var express = require("express");
const port = 8000;
var app = express();
const router = require('./router/router');
const bodyParser = require('body-parser');
const path = require("path");
const db = require("./Connect.js")


const session = require("express-session");
const MySQLStore = require("express-mysql-session")
(session);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const sessionStore = new MySQLStore({
  expiration: 24 * 60 * 60 * 1000, 
  // Sesi akan habis selama 1 hari
  clearExpired : true,
  // membersihkan ses yang udah kedaluarsa
  createDatabaseTable : true,
  // membuat tabel di database secara otomatis
},
db
);

app.use(
  session({
    secret: "secret-key",
    store: sessionStore,
    
  })
)

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
    express.static(path.join(__dirname, "public"), {
      setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        } else if (path.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
          res.setHeader("Content-Type", "image/jpeg");
        } else if (path.endsWith(".png")) {
          res.setHeader("Content-Type", "image/png");
        }
      },
    })
  );
  

app.use(router);

app.listen(port,() =>{
    console.log("server berjalan ");
});