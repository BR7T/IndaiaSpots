import express, {Router, Request, Response} from 'express';
import { userData } from '../types/userData';
import {compare,hashPassword} from '../middleware/bcrypt/hashing';
import {mySqlConnection} from '../middleware/db/mysql';
import {createTokens} from '../middleware/jwt/jwtImplementation';
import { addNewUser } from '../user/addUser';
import { QueryError } from 'mysql2';

const userRouter : Router = express.Router();

userRouter.post('/signin', async function(req : Request,res : Response) {
    const userData : userData = {
        username : "",
        email : req.body.email,
        password : req.body.password
    }
 
    const checkEmailQuery =  'select * from usuario where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], async (err : QueryError | null, results : any) => {
        if(err) throw err;
        if(results.length > 0) {
            let isPasswordEqual = compare(req.body.password, results[0].password);
            if(await isPasswordEqual) {
                res.send({process : true});
            }
            else {
                res.send({process : false});
            }
        }
    });
})

userRouter.post('/signup', async function(req : Request, res : Response) {
    if(req.body.password.length < 8 ) {
        res.status(400);
    }
    
    let message : string | null = null;
    let hashedPassword : string = await hashPassword(req.body.password,12);
    
    const userData : userData = {
        username : req.body.name,
        email : req.body.email,
        password : hashedPassword
    }

    const signupCheckQuery =  'select * from usuario where nome=?;select * from usuario where email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], (err : QueryError | null, results : any | ErrorCallback) => {
        if(err) {console.log(err)}
        else if(results[0].length > 0) {
            message  = "Nome de usuário já está em uso";
        }
        else if(results[1].length > 0) {
            message = 'email já está em uso';
        }
        if(message) {
            res.send({message : message, process : false});
        }
        else if(message == null) {
            addNewUser(mySqlConnection,userData);
            res.send({process : true, message : "Cadastro Concluído"});
        }
    });
});

userRouter.post('/googleSignIn', async function(req : Request,res :Response) {
    const userData : userData = {
        username : req.body.username,
        email : req.body.email,
        password : ""
    }

    const googleUserInsertQuery = 'insert into usuario(nome,email,tipo_autenticacao) values(?,?,"google")';
    const getUserIdQuery = 'select * from usuario where email=?';   
    if (req.body.isNewUser) {
        mySqlConnection.query(googleUserInsertQuery, [userData.username, userData.email], (err: QueryError | null, results: any) => { });
    }
    else {
        mySqlConnection.query(getUserIdQuery, [userData.email], (err: QueryError | null, results: any) => {
            createTokens(res, results);
        });
    }
})

export {userRouter};