const prisma = require("../prisma");

async function criarCliente(req, res) {
  const { nome, email, telefone, endereco } = req.body;

  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        telefone,
        endereco,
      },
    });
    res.status(201).json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar cliente." });
  }
}

async function listarClientes(req, res) {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar clientes" });
  }
}

module.exports = { criarCliente, listarClientes };
