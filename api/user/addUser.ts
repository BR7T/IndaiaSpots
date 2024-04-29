import { QueryError } from "mysql2";
import { userData } from "../types/userData";

export async function addNewUser(mysqlCon, userData, permissionLevel, res) : Promise<any> {
    const authType = "form";
    const addUserQuery: string = 'insert into usuario(nome,email,senha,tipo_autenticacao,permissao) values (?,?,?,?,?)';
    mysqlCon.query(addUserQuery,[userData.username,userData.email,userData.password,authType,permissionLevel], (err : string,results : any) => {
        if(err) {
            checkIfUsernameOrEmailAlreadyTaken(err, res);
        }
    });
}

export async function addNewUserGoogle(mysqlCon, userData) {
    const googleUserInsertQuery = 'insert into Usuario(Nome,Email,tipo_autenticacao,permissao) values(?,?,"google",?)';
    mysqlCon.query(googleUserInsertQuery, [userData.username, userData.email, userData.permissionLevel], (err: QueryError | null, results: any) => {
        if(err) throw err;
    });
}

function checkIfUsernameOrEmailAlreadyTaken(errorMessage, res) {
    if(errorMessage.code == "ER_DUP_ENTRY") {
        if(errorMessage.sqlMessage.includes("nome")) res.send({error : "nome de usuário já está em uso"}) ;
        if(errorMessage.sqlMessage.includes("email")) res.send({error : "email já está em uso"});
    }
    else {res.send(500)}
}

export function populateUserDataObject(data, permissionLevel) {
    const userData : userData = {
        username : data.body.username,
        email : data.body.email,
        password : data.body.password,
        permissionLevel : permissionLevel
    }
    return userData;
}

