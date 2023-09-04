const { error } = require("console");
var db = require("../Connect");
const getMarket = (req, res) => {
  const sql = "SELECT * FROM jenisbarang";
  db.query(sql, (error, result) => {
    // secara default database dlm mysql berbentuk array
    // maka ubah menjadi JSON
    const JenisBarang = JSON.parse(JSON.stringify(result));
    res.render("JenisBarang", { jenis: JenisBarang });
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
    const Barang = JSON.parse(JSON.stringify(result));
    const sql2 = `SELECT * FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang`;
    db.query(sql2, (error, result) => {
      const transaksi = JSON.parse(JSON.stringify(result));

      const sql3 = `SELECT SUM (total_harga) AS total FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang`;
      db.query(sql3, (error, result) => {
        if (error) throw error;
        total = result;
        const formatSaldo = (rupiah) => {
          return rupiah.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          });
        };
        res.render("barang", { bar: Barang, idJ: id, transaksi, formatSaldo });
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

const tambahbarang = (req, res) => {
  const newStock = req.body.stock;
  const sql = `INSERT INTO barang(Nama_barang, harga, Id_JenisBarang, stock, new_stock) VALUES ('${req.body.Nama_barang}',' ${req.body.harga}','${req.body.Id_JenisBarang}','${req.body.stock}','${newStock}') `;
  db.query(sql, (error, result) => {
    if (error) throw error;
    res.redirect("back");
  });
};
const tambahTransaksi = (req, res) => {
  const sql = `INSERT INTO transaksi(id_barang, jumlah, total_harga) VALUES ('${req.body.barang_id}', '${req.body.jumlah}', '${req.body.total}')`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    const sql2 = `UPDATE barang SET new_stock = ${req.body.new_stock} WHERE id_barang = ${req.body.barang_id}`;
    db.query(sql2, (error, result) => {
      if (error) throw error;
      res.redirect("back");
    });
  });
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
};
