import { QueryError } from "mysql2";

export function deleteUser(mysqlCon, userId): Promise<QueryError | string> {
    const deleteUserQuery = "DELETE FROM Usuario WHERE ID_Usuario=?";
    return new Promise((resolve, reject) => {
      mysqlCon.query(deleteUserQuery, [userId], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
}