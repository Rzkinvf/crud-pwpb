const { error } = require("console");
const db = require("../Connect");
const bcyrpt = require("bcrypt");
const login = (req, res) => {
  res.render("login");
};
const register = (req, res) => {
  res.render("register", { clas: "", pesan: "" });
};
const registerasi = (req, res) => {
  const { username, password, pass_confirm } = req.body;
  const Check = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(Check, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      return res.render("register", {
        clas: "danger",
        pesan: "username telah terdaftar, silahkan login",
      });
    }
  });
};
module.exports = { login, register, registerasi };
