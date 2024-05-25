import { QueryError } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export function deleteUser(mysqlCon : Connection, userId : any): Promise<QueryError | string> {
    const deleteUserQuery = "DELETE FROM Usuario WHERE ID_Usuario=?";
    return new Promise((resolve, reject) => {
      mysqlCon.query(deleteUserQuery, [userId], (err : QueryError | null, results : any) => {
        if (err) {
          reject(err);
        }
        resolve('success');
      });
    });
}

export async function deleteUserByEmail(mysqlCon : Connection, email : any): Promise<QueryError | string> {
    const deleteUserQuery = "DELETE FROM Usuario WHERE email=?";
    console.log(email);
    return new Promise((resolve, reject) => {
        mysqlCon.query(deleteUserQuery, [email], (err : QueryError | null, results : any) => {
          if (err) {
            reject(err);
          }
          resolve('success');
        });
    });
}