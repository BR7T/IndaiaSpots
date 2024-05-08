import { QueryError } from "mysql2";
import { PromoData } from "../types/promoData";

export async function updatePromos(mysqlCon,promoId ,updatedData : PromoData) : Promise<QueryError | string> {
    return new Promise((resolve, reject) => {
      const updatePromotionQuery = "UPDATE Promocoes SET ID_Restaurante=?, Data_Inicio=?, Data_Final=?, Hora_Inicio=?, Hora_Final=?, Regras=?, Pratos=? WHERE id_promocoes=?";
      mysqlCon.query(updatePromotionQuery,[
        updatedData.ID_Restaurante,
        updatedData.Data_Inicio,
        updatedData.Data_Final,
        updatedData.Hora_Inicio,
        updatedData.Hora_Final,
        updatedData.Regras,
        updatedData.Pratos,
        promoId
      ], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
};

