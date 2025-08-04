const express = require("express");
const router = express.Router();
const { criarVenda, listarVendas } = require("../controllers/vendaController");

router.post("/vendas", criarVenda);
router.get("/vendas", listarVendas);

module.exports = router;
