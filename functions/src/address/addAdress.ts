import { QueryError } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export async function addAddress(mysqlCon : Connection, data : any) {
    const adressQuery = 'insert into Endereco(Razao_Social,Bairro, Numero, CNPJ, Rua) values(?,?,?,?,?)';
    mysqlCon.query(adressQuery, [data.RazaoSocial,data.Bairro, data.Numero, data.CNPJ, data.Rua], (err : QueryError | null, results : any)  => {
        if(err) console.error(err);
    })
}