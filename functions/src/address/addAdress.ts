import { Request, Response , NextFunction } from "express";
import { QueryError } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

export async function addAddress(mysqlCon : Connection, data : any, next : NextFunction) : Promise<void | Boolean> {
    const adressQuery = 'insert into Endereco(Razao_Social,Bairro, Numero, CNPJ, Rua, ID_Restaurante) values(?,?,?,?,?,?)';
    mysqlCon.query(adressQuery, [data.RazaoSocial,data.Bairro, data.Numero, data.CNPJ, data.Rua, data.ID_Restaurante], (err : QueryError | null, results : any)  => {
        if(err) {
            return next(err);
        };
        return true;
    })
}

export function checkIfInfoAlreadyTaken(err : any, req : Request , res : Response, next : NextFunction) {
    console.log(err.code);
    if (err.code == "ER_DUP_ENTRY") {   
        if (err.sqlMessage.includes("CNPJ")) return res.status(200).send({ error: "Esse cnpj já está em uso!" });
        if (err.sqlMessage.includes("Razao_Social")) return res.status(200).send({ error: "Essa Razão Social já está em uso!" });
    } 
    return next(err);
}