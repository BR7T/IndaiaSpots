import { QueryError } from "mysql2";

export function deletePromo(mySqlConnection, promocaoId: string) : Promise<QueryError | string> {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM Promocoes WHERE ID_Promocoes = ?";
      mySqlConnection.query(query, [promocaoId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve('success')
      });
    });
};