import { QueryError } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export function addRating(mysqlCon : Connection, data : any) : QueryError | void {
    const ratingQuery = 'insert into avaliacoes(id_restaurante,id_usuario,quantidade) values(?,?,?)';
    mysqlCon.query(ratingQuery, [data.restaurantId,data.userId,data.quantity], (err : QueryError | null, results : any)  => {
        if(err) throw err;
    })
}