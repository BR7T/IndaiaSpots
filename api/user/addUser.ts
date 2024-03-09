export function addNewUser(mysqlCon, userData) {
    const addUserQuery: string = 'insert into user(userName,email,password) values (?,?,?)';
    mysqlCon.query(addUserQuery,[userData.username,userData.email,userData.password], (err : string,results : any) => {
        if(err) {
            throw Error('query to insert new user failed');
        }
    });
}