import { QueryError } from "mysql2";

export function addRating(mysqlCon, data) : QueryError | void {
    const ratingQuery = 'insert into avaliacoes(id_restaurante,id_usuario,quantidade) values(?,?,?)';
    mysqlCon.query(ratingQuery, [data.restaurantId,data.userId,data.quantity], (err : QueryError | null, results : any)  => {
        if(err) throw err;
    })
}