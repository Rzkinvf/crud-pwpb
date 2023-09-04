const express = require('express');
const router = express.Router();
const {login, register} =require('../controller/auth.js')
const {
    getMarket, 
    tambahJenis, 
    hapusJenis, 
    pilihBarang, 
    hapusJenisBarang, 
    tambahbarang, 
    tambahTransaksi,
    cancel,
    editJenis
} = require('../controller/JenisBarang.js');

router.get('/login', login);
router.get('/register', register);
router.get('/', getMarket);
router.post('/tambahJenis', tambahJenis);
router.get('/hapusJenis/:Id_JenisBarang', hapusJenis);
router.get('/pilihBarang/:Id_JenisBarang',pilihBarang)
router.get('/hapusbarang/:id_barang', hapusJenisBarang);
router.post('/tambahbarang', tambahbarang);
router.post('/tambahTransaksi', tambahTransaksi);
router.post('/cancelTransaksi', cancel);
router.post('/editJenis', editJenis);

module.exports = router;