export function getUser(mysqlCon, userId : number) {
    const getUserQuery = 'select * from user where id_user = ?';
    mysqlCon.query(getUserQuery,[userId], (err : string,results : Array<JSON>) => {
        if(results.length == 0) {
            throw Error('user with that id not found');
        }
        else {
            return results;
        }
    })
}

export function getAllUsers(mysqlCon) {
    const getUserQuery = 'select * from establishments';
        
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, (err : string, results : Array<any>) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

