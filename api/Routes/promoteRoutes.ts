import express from "express";
import { mySqlConnection } from "../middleware/db/mysql";
import { adicionarPromocao, deletarPromocao } from "../promote/funcPromo";

const promoteRouter = express.Router();

promoteRouter.get("/promocoes", async (req, res) => {
  try {
    const promocoes = await getPromocoes();
    res.json(promocoes);
  } catch (error) {
    console.error("Erro ao buscar promoções:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

const getPromocoes = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Promocoes";
    mySqlConnection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

promoteRouter.get("/promocoes/:id", async (req, res) => {
  const promocaoId = req.params.id;
  try {
    const promocao = await getPromocaoById(promocaoId);
    if (promocao) {
      res.json(promocao);
    } else {
      res.status(404).json({ error: "Promoção não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao buscar promoção:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

const getPromocaoById = (promocaoId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Promocoes WHERE ID_Promocoes = ?";
    mySqlConnection.query(query, [promocaoId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

promoteRouter.post("/promocoes", adicionarPromocao);
promoteRouter.delete("/promocoes/:id", deletarPromocao);
promoteRouter.put("/promocoes/encerrar", async (req, res) => {
  try {
    const { tempo } = req.body;
    if (!tempo) {
      return res
        .status(400)
        .json({ error: 'O parâmetro "tempo" é obrigatório' });
    }
    await encerrarPromocoes(tempo);

    res.status(200).json({ message: "Promoções encerradas com sucesso" });
  } catch (error) {
    console.error("Erro ao encerrar promoções:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

const encerrarPromocoes = (tempo) => {
  return new Promise((resolve, reject) => {
    resolve("Promoções encerradas com sucesso");
  });
};

export { promoteRouter };
