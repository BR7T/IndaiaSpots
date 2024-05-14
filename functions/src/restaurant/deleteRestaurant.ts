import { Connection, QueryError } from "mysql2";

export function deleteRestaurant(mysqlCon : Connection,restaurantId: number): Promise<QueryError | string> {
    const deleteQuery = "DELETE FROM restaurante WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
      mysqlCon.query(deleteQuery, [restaurantId], (err : QueryError | null, results : any) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
}