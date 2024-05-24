import { QueryError } from "mysql2";
import { RestaurantData } from "../types/restaurantData";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export function updateRestaurant(mysqlCon : Connection,restaurantId: number,updatedData: RestaurantData): Promise<QueryError | string> {
    const updateQuery = "UPDATE restaurante SET nome=?, contato=?, horario_atendimento=?, dia_atendimento=?, tipo_cozinha=?, CNPJ=? WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
    mysqlCon.query(updateQuery,
    [
      updatedData.nome,
      updatedData.contato,
      updatedData.horario_atendimento,
      updatedData.dia_atendimento,
      updatedData.tipo_cozinha,
      restaurantId
    ],(err : QueryError | null , results : any) => {
        if(err) {
          reject(err);
        } 
        resolve('success');
      });
    });
}


