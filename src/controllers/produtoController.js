const prisma = require("../prisma");

async function criarProduto(req, res) {
  const { nome, tipo, custo, precoVenda } = req.body;

  try {
    const produto = await prisma.produto.create({
      data: {
        nome,
        tipo,
        custo,
        precoVenda,
      },
    });
    res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar produto" });
  }
}

async function listarProdutos(req, res) {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(201).json(produtos);
  } catch {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar produtos" });
  }
}

module.exports = { criarProduto, listarProdutos };
