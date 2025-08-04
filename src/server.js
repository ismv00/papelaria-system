const express = require("express");
const cors = require("cors");
const clienteRoutes = require("./routes/clienteRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", clienteRoutes);
app.use("/api", produtoRoutes);
app.use("/api", produtoRoutes);
app.use("/api", vendaRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http:localhost:3000");
});
