import {QueryError} from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import { userData } from "../types/userData";

export function getUserById(mysqlCon : Connection, userId: number): Promise<Array<JSON> | string> {
    const getUserQuery = 'select * from Usuario where ID_Usuario = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [userId], (err: QueryError | null, results: any) => {
            if (err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export function getUsernameById(mysqlCon : Connection, userId: string): Promise<Array<JSON> | string | any> {
    const getUserQuery = 'select * from Usuario where ID_Usuario = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [userId], (err: QueryError | null, results: any) => {
            if (err) reject(err)
            else {
                const email : string = results[0].email;
                const username : string = results[0].Nome;
                const array = {
                    email : email,
                    username : username
                }
                resolve(array);
            }
        })
    })
}

export async function getUserByEmail(mysqlCon : Connection, email : string): Promise<Array<JSON> | string> {
    const getUserQuery = 'select * from Usuario where email = ?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(getUserQuery, [email], (err: QueryError | null, results: any) => {
            if (err) reject(err)
            else {
                resolve(results);
            }
        })
    })
}

export function getAllUsers(mysqlCon : Connection): Promise<Array<JSON> | string> {
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

export function checkIfUserExists(mysqlCon : Connection, userData : userData): Promise<boolean> {
    const signupCheckQuery = 'select * from user where userName=? or email=?';
    return new Promise((resolve, reject) => {
        mysqlCon.query(signupCheckQuery, [userData.username, userData.email], (err: QueryError | null, results: Array<any>) => {
            if (err) {
                reject(err);
            }
            else if (results && results.length > 0) {
                resolve(true)
            }
            resolve(false)
        })
    })
}

export async function checkIfUserExistsByEmail(mysqlCon : Connection, userData : userData): Promise<boolean> {
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



