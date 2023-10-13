const { error, log } = require("console");
const db = require("../Connect");
const bcrypt = require("bcrypt");

const login = (req, res) => {
  res.render("login", { clas: "", pesan: "" });
};
const register = (req, res) => {
  res.render("register", { clas: "", pesan: "" });
};
const logout = (req,res) =>{
  req.session.destroy();
  res.render("login",{
    pesan: "berhsil logout",
    clas: "success",
    username:"",
  })
}
const registerasi = (req, res) => {
  const { username, password, pass_confirm } = req.body;
  const Check = `SELECT * FROM user WHERE username = '${username}'`;
  db.query(Check, (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      return res.render("register", {
        clas: "danger",
        pesan: "username telah terdaftar, silahkan login",
        username: req.body.username,
      });
    }
    if(password != pass_confirm) {
        return res.render("register", {
            clas: "danger",
            pesan: "password anda tidak sesuai",
            username: req.body.username,
        })
    }
    bcrypt.hash(password,10, (errorhash, hash) => {
        if (errorhash) throw errorhash 
        const min = 100000;
        const max = 999999;
        const token = Math.floor(Math.random() * (max - min + 1) + min);
        const sql = `INSERT INTO user(username, password, token, role) VALUES ('${username}', '${hash}','${token}', '1')`
        db.query(sql,(error, result) =>{
            if (error) throw error;
            res.render(`register`,{
                clas: 'success',
                pesan:'berhasil',
                // username:'',
            });
        })
    });
  });
};

const auth = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('login', {
      pesan: "Username dan password tidak boleh kosong",
      clas: "danger",
      // username: "",
    });
  }
  const sql = `SELECT * FROM user WHERE username  = '${username}'`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    if (result.length === 0) {
      return res.render("login", {
        pesan: "Username tidak ada",
        clas: "danger",
        // username: "",
      });
    }
    // Jika user ditemukan
    const user = result[0];
    bcrypt.compare(password, user.password, (bcrypterror, bcryptRespon) => {
      if (bcrypterror) throw bcrypterror;
      if (!bcryptRespon) {
        return res.render("login", {
          pesan: "Password salah",
          clas: "danger",
        });
      }
      req.session.user = {
        id: user.id_user,
        username: user.username,
      };
      res.redirect("/Market");
    });
  });
}
module.exports = { login, register, registerasi, auth, logout };
