const express = require("express");
const router = express.Router();
const {
  criarVenda,
  listarVendas,
  calcularLucroTotal,
  listarVendasPorPeriodo,
} = require("../controllers/vendaController");

router.post("/vendas", criarVenda);
router.get("/vendas", listarVendas);
router.get("/vendas/lucro-total", calcularLucroTotal);
router.get("/vendas/periodo", listarVendasPorPeriodo);

module.exports = router;
