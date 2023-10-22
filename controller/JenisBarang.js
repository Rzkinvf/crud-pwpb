const { error } = require("console");
var db = require("../Connect");

const getMarket = (req, res) => {
  const sql = "SELECT * FROM jenisbarang";
  // secara default database dlm mysql berbentuk array
  // maka ubah menjadi JSON
  db.query(sql, (error, result) => {
    const JenisBarang = JSON.parse(JSON.stringify(result));
    if (req.session.user) {
      const sql = `SELECT * FROM user WHERE username = '${req.session.user.username}'`;
      db.query(sql, (error, result) => {
        if (error) throw error;
        const user = result[0];
        console.log(user);
        const formatSaldo = (rupiah) => {
          return rupiah.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          });
        };
        res.render("JenisBarang", {
          jenis: JenisBarang,
          user: user,
          formatSaldo,
        });
      });
    } else {
      
      res.render("JenisBarang", {
        jenis: JenisBarang,
        user: "",
      });
    }
  });
};

const tambahJenis = (req, res) => {
  const sql = `INSERT INTO jenisbarang(jenisBarang) VALUES
    ('${req.body.jenisBarang}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("/");
  });
};
const hapusJenis = (req, res) => {
  const id = req.params.Id_JenisBarang;
  const sql = "DELETE FROM JenisBarang WHERE Id_JenisBarang = ?";
  db.query(sql, id, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

const pilihBarang = (req, res) => {
  const id = req.params.Id_JenisBarang;
  const sql = `SELECT * FROM barang WHERE Id_JenisBarang = ('${id}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    total = result;
    const formatSaldo = (rupiah) => {
      return rupiah.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      });
    };
    const Barang = JSON.parse(JSON.stringify(result));
    const sql2 = `SELECT * FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang`;
    db.query(sql2, (error, result) => {
      const transaksi = JSON.parse(JSON.stringify(result));

      const sql3 = `SELECT SUM (total_harga) AS total FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang`;
      db.query(sql3, (error, result) => {
        if (error) throw error;

        if (req.session.user) {
          const sql = `SELECT * FROM user WHERE username = '${req.session.user.username}'`;
          db.query(sql, (error, result) => {
            if (error) throw error;
            const user = result[0];
            console.log(user);
            const sql2 = `SELECT * FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id} `;
            db.query(sql2, (error, result2) => {
              const transaksi = result2;

              const sql3 = `SELECT SUM(total_harga) AS total FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
              db.query(sql3,(error,result3) => {
                if (error) throw error;
                total = result3
                console.log(user);
                res.render("barang", {
                   bar: Barang, 
                   idJ: id, 
                   transaksi, 
                   formatSaldo,
                   total,
                    user: user,
                  });
              })
            })
          });
        } else {
          
          res.render("barang", {
             bar: Barang, 
             idJ: id, 
             transaksi, 
             formatSaldo,
             total,
             user: "", });
        }
        
      });
    });
  });
};
const hapusJenisBarang = (req, res) => {
  const id = req.params.id_barang;
  const sql = "DELETE FROM barang WHERE id_barang = ?";
  db.query(sql, id, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};
const hapusTransaksi = (req, res) => {
  const id = req.params.id_barang;
  const sql = "DELETE FROM transaksi WHERE id_barang = ?";
  db.query(sql, id, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

const tambahbarang = (req, res) => {
  const newStock = req.body.stock;
  const image = req.file ? req.file.filename : null;
  const sql = `INSERT INTO barang(Nama_barang, harga, Id_JenisBarang, stock, new_stock, image) VALUES ('${req.body.Nama_barang}',' ${req.body.harga}','${req.body.Id_JenisBarang}','${req.body.stock}','${newStock}', '${image}') `;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};
const tambahTransaksi = (req, res) => {
  if (!req.session.user) {
    return res.render("login", {
      pesan: "Anda harus login terlebih dahulu",
      clas: "danger",
    })
  } else {
    const sql = `INSERT INTO transaksi(id_barang, jumlah, total_harga, id_user, status) VALUES ('${req.body.barang_id}', '${req.body.jumlah}', '${req.body.total}', '${req.session.user.id}', '0')`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      const sql2 = `UPDATE barang SET new_stock = ${req.body.new_stock} WHERE id_barang = ${req.body.barang_id}`;
      db.query(sql2, (error, result) => {
        if (error) throw error;
        res.redirect("back");
      });
    });
  }
};

// console.log(req.body.stockBaru)
const cancel = (req, res) => {
  const sql = `UPDATE barang SET new_stock = '${req.body.stockBaru}' WHERE id_barang = ${req.body.barang_id2}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    const sql2 = `DELETE FROM transaksi WHERE id_transaksi = ${req.body.id_transaksi}`;
    db.query(sql2, (error, result) => {
      if (error) throw error;
      res.redirect("back");
    });
  });
};

const editJenis = (req, res) => {
  const sql = `UPDATE jenisbarang SET jenisBarang = '${req.body.Jeniss}' WHERE Id_JenisBarang = ${req.body.id_jeniss}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};
const shop = (req, res) => {
  const id = req.params.Id_JenisBarang;
  const sql = `SELECT * FROM barang WHERE Id_JenisBarang = ('${id}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    const Barang = result;
    res.render("shop", { Barang });
  });
};
const editBarang = (req, res) => {
  const sql = `UPDATE barang SET Nama_barang = '${req.body.nama_Ebarang}', harga = '${req.body.harga_Ebarang}' WHERE id_barang = ${req.body.id_Ebarang}`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};

const bayar = (req, res) =>{
  if (req.session.user) {
    const sql = `UPDATE user SET saldo = '${req.body.u_saldo}' WHERE id_user = ${req.session.user.id}`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      res.redirect("back");
      const sql = `UPDATE transaksi AS t INNER JOIN barang AS b ON t.id_barang = b.id_barang SET t.status = '1', b.stock = ${req.body.B_stock} WHERE t.id_transaksi = ${req.body.B_id_transaksi};`;
      db.query(sql, (error, result) => {
        if (error) throw error;
    })
    })
  }
}
module.exports = {
  getMarket,
  tambahJenis,
  hapusJenis,
  pilihBarang,
  hapusJenisBarang,
  tambahbarang,
  tambahTransaksi,
  cancel,
  editJenis,
  shop,
  editBarang,
  bayar,
};
