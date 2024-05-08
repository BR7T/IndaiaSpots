import { QueryError } from "mysql2";
import { RestaurantData } from "../types/restaurantData";

export function updateRestaurant(mysqlCon,restaurantId: number,updatedData: RestaurantData): Promise<QueryError | string> {
    const updateQuery = "UPDATE restaurante SET nome=?, contato=?, horario_atendimento=?, dia_atendimento=?, tipo_cozinha=?, CNPJ=? WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
    mysqlCon.query(updateQuery,
    [
      updatedData.nome,
      updatedData.contato,
      updatedData.horario_atendimento,
      updatedData.dia_atendimento,
      updatedData.tipo_cozinha,
      updatedData.CNPJ,
      restaurantId
    ],(err, results) => {
        if(err) {
          reject(err);
        } 
        resolve('success');
      });
    });
}


