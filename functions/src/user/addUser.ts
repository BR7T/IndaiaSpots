import { QueryError } from "mysql2";
import { userData } from "../types/userData";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { Request, Response ,NextFunction } from "express";
import { sanitizeParams } from "../Routes/restaurantRoutes";


export async function addNewUser(mysqlCon : Connection, userData : any, res : Response , next : NextFunction): Promise< QueryError | void | boolean | any> {
    const authType = "form";
    const addUserQuery: string = 'insert into Usuario(nome,email,senha,tipo_autenticacao,Nivel_Permissao) values (?,?,?,?,?)';
    mysqlCon.query(addUserQuery, [userData.username, userData.email, userData.password, authType, userData.permissionLevel], (err: QueryError | null, results: any) => {
        if (err) {
            next(err);
        }
        res.send({process : true});
    });
}

export async function addNewUserRestaurant(mysqlCon : Connection, userData : any): Promise< QueryError | void | boolean> {
    const authType = "form";
    const addUserQuery: string = 'insert into Usuario (nome,email,senha,tipo_autenticacao,Nivel_Permissao) values (?,?,?,?,?)';
    const sanitizedParams = sanitizeParams([userData.username, userData.email, userData.password, authType, userData.permissionLevel])
    await mysqlCon.promise().query(addUserQuery, sanitizedParams)
}

export function checkIfUsernameOrEmailAlreadyTaken(err : any, req : Request , res : Response, next : NextFunction) {
    console.log(err);
    if (err.code === "ER_DUP_ENTRY") {   
        if (err.sqlMessage.includes("email")) return res.status(200).send({ error: "Esse email já está em uso!" , form : 'Usuario'});
        if (err.sqlMessage.includes("Nome")) return res.status(200).send({ error: "Esse nome de usuário já está em uso!" , form : 'Usuario'});
    } 
    return next(err);
}

export async function addNewUserGoogle(mysqlCon : Connection, userData : userData) : Promise<QueryError | void> {
    const googleUserInsertQuery = 'insert into Usuario (Nome,Email,tipo_autenticacao,Nivel_Permissao) values (?,?,"google",?)';
    mysqlCon.query(googleUserInsertQuery, [userData.username, userData.email, userData.permissionLevel], (err: QueryError | null, results: any) => {
        if (err) throw err;
    });
}

export function populateUserDataObject(data : any, permissionLevels : any) {
    const userData: userData = {
        username: data.body.username,
        email: data.body.email,
        password: data.body.password,
        permissionLevel: permissionLevels
    }
    return userData;
}


