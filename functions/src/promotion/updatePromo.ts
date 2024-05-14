import { QueryError } from "mysql2";
import { PromoData } from "../types/promoData";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export async function updatePromos(mysqlCon : Connection,promoId : any ,updatedData : PromoData) : Promise<QueryError | string> {
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
      ], (err : QueryError | null, results : any) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
};

