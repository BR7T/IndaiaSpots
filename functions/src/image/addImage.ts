import { Connection, QueryError } from "mysql2";


export function addImage(mySqlConnection : Connection , filename : string) : Promise<QueryError | string> {
    const url = `https://d1rz3fbu8zmjz5.cloudfront.net/${filename}`;
    const insertQuery = 'insert into Imagem(URL) values (?)';
    return new Promise((resolve, reject) => {
        mySqlConnection.query(insertQuery,[url], (err : QueryError | null, results : any) => {
            if(err) reject(err);
            else {
                resolve('success');
            }
        })
    })
}

