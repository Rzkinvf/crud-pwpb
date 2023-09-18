const express = require("express");
const router = express.Router();
const { login, register, registerasi } = require("../controller/auth.js");
const {
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
} = require("../controller/JenisBarang.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename : (req,file,cb) =>{
    cb(null,file.originalname);
  },
});
const upload = multer({storage})

router.get("/login", login);
router.get("/register", register);
router.post("/registerasi", registerasi);
router.get("/", getMarket);
router.post("/tambahJenis", tambahJenis);
router.get("/hapusJenis/:Id_JenisBarang", hapusJenis);
router.get("/pilihBarang/:Id_JenisBarang", pilihBarang);
router.get("/hapusbarang/:id_barang", hapusJenisBarang);
router.post("/tambahbarang", upload.single("photo"), tambahbarang);
router.post("/tambahTransaksi", tambahTransaksi);
router.post("/cancelTransaksi", cancel);
router.post("/editJenis", editJenis);
router.post("/editBarang", editBarang);
router.get("/shop/:Id_JenisBarang", shop);

module.exports = router;
