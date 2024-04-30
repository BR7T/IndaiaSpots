import { RowDataPacket } from "mysql2";
import { Request, Response } from "express";
import { mySqlConnection } from "../middleware/db/mysql";

interface PromoData {
  ID_Restaurante: number;
  Data_Inicio: string;
  Data_Final: string;
  Hora_Inicio: string;
  Hora_Final: string;
  Regras: string;
  Pratos: string;
}

export const adicionarPromocao = async (req: Request, res: Response) => {
  try {
    const {
      ID_Restaurante,
      Data_Inicio,
      Data_Final,
      Hora_Inicio,
      Hora_Final,
      Regras,
      Pratos,
    }: PromoData = req.body;

    if (
      !ID_Restaurante ||
      !Data_Inicio ||
      !Data_Final ||
      !Hora_Inicio ||
      !Hora_Final ||
      !Regras ||
      !Pratos
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    const result = await criarPromocao(
      ID_Restaurante,
      Data_Inicio,
      Data_Final,
      Hora_Inicio,
      Hora_Final,
      Regras,
      Pratos
    );
    res.status(201).json({
      message: "Promoção criada com sucesso",
      id: (result as RowDataPacket).insertId,
    });
  } catch (error) {
    console.error("Erro ao criar promoção:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
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

const criarPromocao = (
  ID_Restaurante: number,
  Data_Inicio: string,
  Data_Final: string,
  Hora_Inicio: string,
  Hora_Final: string,
  Regras: string,
  Pratos: string
) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Promocoes (ID_Restaurante, Data_Inicio, Data_Final, Hora_Inicio, Hora_Final, Regras, Pratos) VALUES (?, ?, ?, ?, ?, ?, ?)";
    mySqlConnection.query(
      query,
      [
        ID_Restaurante,
        Data_Inicio,
        Data_Final,
        Hora_Inicio,
        Hora_Final,
        Regras,
        Pratos,
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
