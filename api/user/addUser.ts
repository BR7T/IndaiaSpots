import { QueryError } from "mysql2";
import { userData } from "../types/userData";

export async function addNewUser(mysqlCon, userData, permissionLevel, next): Promise< QueryError | void> {
    const authType = "form";
    const addUserQuery: string = 'insert into usuario(nome,email,senha,tipo_autenticacao,permissao) values (?,?,?,?,?)';
    mysqlCon.query(addUserQuery, [userData.username, userData.email, userData.password, authType, permissionLevel], (err: string, results: any) => {
        if (err) {
            return next(err);
        }
    });
}

export function checkIfUsernameOrEmailAlreadyTaken(err, req, res, next) {
    if (err.code == "ER_DUP_ENTRY") {
        if (err.sqlMessage.includes("nome")) return res.send({ error: "nome de usuário já está em uso" });
        if (err.sqlMessage.includes("email")) return res.send({ error: "email já está em uso" });
    }
    next(err);
}

export async function addNewUserGoogle(mysqlCon, userData) : Promise<QueryError | void> {
    const googleUserInsertQuery = 'insert into Usuario(Nome,Email,tipo_autenticacao,permissao) values(?,?,"google",?)';
    mysqlCon.query(googleUserInsertQuery, [userData.username, userData.email, userData.permissionLevel], (err: QueryError | null, results: any) => {
        if (err) throw err;
    });
}

export function populateUserDataObject(data, permissionLevel) {
    const userData: userData = {
        username: data.body.username,
        email: data.body.email,
        password: data.body.password,
        permissionLevel: permissionLevel
    }
    return userData;
}

