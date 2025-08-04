const express = require("express");
const router = express.Router();
const {
  criarCliente,
  listarClientes,
} = require("../controllers/clienteController");

router.post("/clientes", criarCliente);
router.get("/clientes", listarClientes);

module.exports = router;
