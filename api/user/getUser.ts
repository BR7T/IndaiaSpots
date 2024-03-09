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

export function checkIfUserExists(mysqlCon,userData) {
    const signupCheckQuery =  'select * from user where userName=? or email=?';
    return new Promise((resolve,reject) => {
        mysqlCon.query(signupCheckQuery,[userData.username, userData.email], (err : string,results : Array<any>) => {
            if (err) {
                reject(err);
            }
            else if(results && results.length > 0){
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}

