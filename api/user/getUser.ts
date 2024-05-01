import { QueryError } from "mysql2";

export function getUserById(mysqlCon, userId: number) {
    const getUserQuery = 'select * from usuario where ID_Usuario = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [userId], (err: string, results: Array<JSON>) => {
            if (err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export async function getUserByEmail(mysqlCon, email: string): Promise<Array<any>> {
    const getUserQuery = 'select * from usuario where email = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [email], (err: string, results: Array<JSON>) => {
            if (err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export function getAllUsers(mysqlCon): Promise<Array<JSON>> {
    const getUserQuery = 'select * from establishments';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, (err: string, results: Array<any>) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

export function checkIfUserExists(mysqlCon, userData): Promise<boolean> {
    const signupCheckQuery = 'select * from user where userName=? or email=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(signupCheckQuery, [userData.username, userData.email], (err: string, results: Array<any>) => {
            if (err) {
                reject(err);
            }
            else if (results && results.length > 0) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
}

export async function checkIfUserExistsByEmail(mysqlCon, userData): Promise<boolean> {
    const checkEmailQuery = 'select * from usuario where email=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(checkEmailQuery, [userData.email], async (err: QueryError | null, results: any) => {
            if (err) reject(err);
            if (results.length > 0) {
                resolve(true);
            }
            resolve(false);
        });
    })
}



