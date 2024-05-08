import { QueryError } from "mysql2";
import { mySqlConnection } from "../middleware/db/mysql";
import { PromoData } from "../types/promoData";

export async function addPromotion(mysqlCon, promoData, next) : Promise<QueryError | string> {
    return new Promise((resolve, reject) => {
        const query ="INSERT INTO Promocoes (ID_Restaurante, Data_Inicio, Data_Final, Hora_Inicio, Hora_Final, Regras, Pratos) VALUES (?, ?, ?, ?, ?, ?, ?)";
        mySqlConnection.query(query,
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
                  next(err);
              } else {
                  resolve('success');
              }
          }
        );
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
