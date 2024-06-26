import { Request, Response , NextFunction } from "express";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { sanitizeParams } from "../Routes/restaurantRoutes";

export async function addAddress(mysqlCon : Connection, data : any) : Promise<void> {
    const addressQuery = 'INSERT INTO Endereco (Razao_Social, Bairro, Numero, CNPJ, Rua, ID_Restaurante) VALUES (?, ?, ?, ?, ?, ?)';
    const sanitizedParams = sanitizeParams([data.RazaoSocial, data.Bairro, data.Numero, data.CNPJ, data.Rua, data.ID_Restaurante]);
    await mysqlCon.promise().query(addressQuery, sanitizedParams) 
}

export function checkIfInfoAlreadyTaken(err : any, req : Request , res : Response, next : NextFunction) {
    console.log(err.code);
    if (err.code == "ER_DUP_ENTRY") {   
        if (err.sqlMessage.includes("CNPJ")) return res.status(200).send({ error: "Esse CNPJ já está em uso", form : 'Endereco' });
        if (err.sqlMessage.includes("Razao_Social")) return res.status(200).send({ error: "Esse Nome já está em uso" , form : 'Endereco' });
    } 
    return next(err);
}