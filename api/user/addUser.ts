import { userData } from "../types/userData";

export function addNewUser(mysqlCon, userData, permissionLevel) : void {
    const authType = "form";
    const addUserQuery: string = 'insert into usuario(nome,email,senha,tipo_autenticacao,permissao) values (?,?,?,?,?)';
    mysqlCon.query(addUserQuery,[userData.username,userData.email,userData.password,authType,permissionLevel], (err : string,results : any) => {
        if(err) {
            throw Error('query to insert new user failed');
        } 
    });
}

export function populateUserDataObject(data) {
    const userData : userData = {
        username : data.body.username,
        email : data.body.email,
        password : data.body.password
    }
    return userData;
}