export function addNewUser(mysqlCon, userData) : void {
    const admin = false;
    const authType = "form";
    const addUserQuery: string = 'insert into usuario(nome,email,senha, tipo_autenticacao,Administrator) values (?,?,?,?,?)';
    mysqlCon.query(addUserQuery,[userData.username,userData.email,userData.password,authType,admin], (err : string,results : any) => {
        if(err) {
            throw Error('query to insert new user failed');
        }
    });
}