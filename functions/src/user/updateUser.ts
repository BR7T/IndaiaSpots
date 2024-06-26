import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { userData } from "../types/userData";
import { QueryError } from "mysql2";

export async function updateUser(mysqlCon : Connection, userId : any ,updatedData : userData) : Promise<QueryError | string> {
    return new Promise((resolve, reject) => {
      const updatePromotionQuery = "UPDATE Usuario SET Nome=?, email=?, Senha=?, Permissao=? WHERE ID_Usuario=?";
      mysqlCon.query(updatePromotionQuery,[
        updatedData.username,
        updatedData.email,
        updatedData.password,
        updatedData.permissionLevel,
        userId
      ], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
};
