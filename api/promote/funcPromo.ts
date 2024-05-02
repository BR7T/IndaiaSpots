import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { mySqlConnection } from "../middleware/db/mysql";
import { PromoData } from "../types/promoData";

export const adicionarPromocao = async (req: Request, res: Response) => {
  try {
      const promoData = populatePromoDataObject(req.body);
      const result = await criarPromocao(promoData);
      res.status(201).send({
        message: "Promoção criada com sucesso",
        id: (result as RowDataPacket).insertId,
      });
    } catch (error) {
      console.error("Erro ao criar promoção:", error);
      res.status(500).send({ error: "Erro interno do servidor" });
    }
};

export const deletarPromocao = async (req: Request, res: Response) => {
  const promocaoId = req.params.id;
  try {
    await deletarPromocaoDB(promocaoId);
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao deletar promoção:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const criarPromocao = (promoData) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Promocoes (ID_Restaurante, Data_Inicio, Data_Final, Hora_Inicio, Hora_Final, Regras, Pratos) VALUES (?, ?, ?, ?, ?, ?, ?)";
    mySqlConnection.query(
      query,
      [
        promoData.ID_Restaurante,
        promoData.Data_Inicio,
        promoData.Data_Final,
        promoData.Hora_Inicio,
        promoData.Hora_Final,
        promoData.Regras,
        promoData.Pratos,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const deletarPromocaoDB = (promocaoId: string) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM Promocoes WHERE ID_Promocoes = ?";
    mySqlConnection.query(query, [promocaoId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

export function populatePromoDataObject(promoData) {
  const promoDataObject : PromoData = {
    ID_Restaurante : promoData.ID_Restaurante,
    Data_Inicio : promoData.Data_Inicio,
    Data_Final : promoData.Data_Final,
    Hora_Inicio : promoData.Hora_Inicio,
    Hora_Final : promoData.Hora_Final,
    Regras : promoData.Regras,
    Pratos :promoData.Pratos,
  }
  return promoDataObject;
}
