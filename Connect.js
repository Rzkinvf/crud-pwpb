var mysql = require('mysql')
var db = mysql.createConnection({
    host :"localhost",
    user:"root",
    password : "",
    database  :"market_rizki_xiirpl1"
})

db.connect(function(err){
    if (err) throw err;
    console.log("connect");
});

module.exports = db;