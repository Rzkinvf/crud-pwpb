const { error } = require("console")
const db = require("../Connect")
const bcyrpt = require('bcrypt')
const login = (req, res)=>{
    res.render('login')
}
const register = (req, res)=>{
    res.render('register', {class: "", pesan:""})
}
const registerasi = (req, res) => {
    const {username, password, pass_confirm } = req.body;
    const Check = `SELECT * FROM user WHERE username = ${username}`
    db.query(Check,(error, result) => {
        if (result.length > 0) {
            return res.render("register", {clas:"danger"})
        }
    })
}
module.exports = {login, register};