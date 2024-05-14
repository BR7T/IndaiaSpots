import { QueryError, QueryResult } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export function deletePromo(mySqlConnection : Connection , promocaoId: string) : Promise<QueryError | string> {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM Promocoes WHERE ID_Promocoes = ?";
      mySqlConnection.query(query, [promocaoId], (err: QueryError | null, results: QueryResult) => {
        if (err) {
          reject(err);
        }
        resolve('success')
      });
    });
};