import { Connection, QueryError } from "mysql2";


export function addImage(mySqlConnection : Connection , body : any) : Promise<QueryError | string> {
    const url = `https://d1rz3fbu8zmjz5.cloudfront.net/${body.filename}`;
    const insertQuery = 'insert into Imagem(URL, ID_Restaurante) values (?,?)';
    return new Promise((resolve, reject) => {
        mySqlConnection.query(insertQuery,[url,body.ID_Restaurante], (err : QueryError | null, results : any) => {
            if(err) reject(err);
            else {
                resolve('success');
            }
        })
    })
}

