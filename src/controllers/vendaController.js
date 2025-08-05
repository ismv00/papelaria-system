const prisma = require("../prisma");

async function criarVenda(req, res) {
  const { clienteId, itens } = req.body;

  try {
    let total = 0;
    const produtosCompletos = await Promise.all(
      itens.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        }

        total += item.quantidade * produto.precoVenda;

        return {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: produto.precoVenda,
        };
      })
    );

    const venda = await prisma.venda.create({
      data: {
        clienteId,
        total,
        itens: {
          create: produtosCompletos,
        },
      },
      include: {
        itens: true,
      },
    });

    res.status(201).json(venda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar a venda" });
  }
}

async function listarVendas(req, res) {
  try {
    const vendas = await prisma.venda.findMany({
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    const vendasComLucro = vendas.map((venda) => {
      let lucroTotal = 0;

      const itensDetalhados = venda.itens.map((item) => {
        const lucroItem =
          (item.precoUnitario - item.produto.custo) * item.quantidade;
        lucroTotal += lucroItem;

        return {
          id: item.id,
          produto: item.produto.nome,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          custoProduto: item.produto.custo,
          lucroItem: lucroItem.toFixed(2),
        };
      });

      return {
        id: venda.id,
        cliente: venda.cliente.nome,
        data: venda.data,
        total: venda.total,
        lucroTotal: lucroTotal.toFixed(2),
        itens: itensDetalhados,
      };
    });

    res.json(vendasComLucro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar vendas" });
  }
}

async function calcularLucroTotal(req, res) {
  try {
    const itens = await prisma.itemVenda.findMany({
      include: {
        produto: true,
      },
    });

    const lucroTotal = itens.reduce((total, item) => {
      const lucroUnitario = item.precoUnitario - item.produto.custo;
      const lucroItem = lucroUnitario * item.quantidade;
      return total + lucroItem;
    }, 0);

    res.json({ lucroTotal: lucroTotal.toFixed(2) });
  } catch (error) {
    console.error("erro ao cacular o lucro total", error);
    res.status(500).json({ erro: "Erro ao calcular o lucro total" });
  }
}

async function listarVendasPorPeriodo(req, res) {
  const { inicio, fim } = req.query;

  if (!inicio || !fim) {
    return res
      .status(400)
      .json({ erro: "Informe as datas de inicio e fim no formato YYYY-MM-DD" });
  }

  try {
    const vendas = await prisma.venda.findMany({
      where: {
        data: {
          gte: new Date(inicio),
          lte: new Date(fim + "T23:59:59.999Z"),
        },
      },
      include: {
        cliente: true,
        itens: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    res.json(vendas);
  } catch (error) {
    console.error("Erro ao listar vendas por periodo", error);
    res.status(500).json({ error: "Erro ao buscar vendas por periodo" });
  }
}

module.exports = {
  criarVenda,
  listarVendas,
  calcularLucroTotal,
  listarVendasPorPeriodo,
};
