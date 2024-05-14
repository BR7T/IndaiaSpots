import { NextFunction } from "express";
import { QueryError} from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export async function getPromos(mysqlCon : Connection) : Promise<string | JSON[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM Promocoes";
      mysqlCon.query(query, (err : QueryError, results : any) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
}

export async function getPromoById(mysqlCon : Connection, promoId : string, next : NextFunction) {
    const query = "SELECT * FROM Promocoes WHERE ID_Promocoes = ?";
    return new Promise((resolve, reject) => {
        mysqlCon.query(query, [promoId], (err: QueryError | null, results: any) => {
            if (err) {
                next(err)
            } else {
                resolve(results[0]);
            }
        });
    });
}

