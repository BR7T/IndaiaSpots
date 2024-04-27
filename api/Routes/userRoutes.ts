import express, {Router, Request, Response} from 'express';
import { userData } from '../types/userData';
import {compare,hashPassword} from '../middleware/bcrypt/hashing';
import {mySqlConnection} from '../middleware/db/mysql';
import {createTokens} from '../middleware/jwt/jwtImplementation';
import { addNewUser, checkIfUsernameOrEmailAlreadyTaken } from '../user/addUser';
import { QueryError } from 'mysql2';
import { populateUserDataObject } from '../user/addUser';

const userRouter : Router = express.Router();

userRouter.post('/signin', async function(req : Request,res : Response) {
    const userData = populateUserDataObject(req);
    
    const checkEmailQuery =  'select * from usuario where email=?';
    mySqlConnection.query(checkEmailQuery,[userData.email], async (err : QueryError | null, results : any) => {
        if(err) throw err;
        if(results.length > 0) {
            let isPasswordEqual = compare(req.body.password, results[0].Senha);
            if(await isPasswordEqual) {
                res.send({process : true });
            }
            else {
                res.send({error : "email or password invalid"});
            }
        }
    });
})


userRouter.post('/signup', async function(req : Request, res : Response) {
    if(req.body.password.length < 8 ) {
        res.status(400).send({error : "password must have 8 or more characters"});
    }

    let hashedPassword : string = await hashPassword(req.body.password,12);
    const userData : userData = {
        username : req.body.name,
        email : req.body.email,
        password : hashedPassword
    }

    const signupCheckQuery =  'select * from usuario where Nome=? or Email=?';
    mySqlConnection.query(signupCheckQuery,[userData.username,userData.email], async (err : QueryError | null, results : any | ErrorCallback) => {
        if(err) {console.log(err)}
        const isAlreadyInUse = checkIfUsernameOrEmailAlreadyTaken(userData,results[0]);
        if(isAlreadyInUse == null) {
            addNewUser(mySqlConnection,userData,"Comum");
            res.send({process : true, message : "Cadastro Concluído"});
        } 
        else if(isAlreadyInUse == 'username') res.send({error : 'usuario já está em uso'});
        else if(isAlreadyInUse == 'email') res.send({error : 'email já está em uso'});
    });
});

userRouter.post('/googleSignIn', async function(req : Request,res :Response) {
    const userData = populateUserDataObject(req);

    const googleUserInsertQuery = 'insert into Usuario(Nome,Email,tipo_autenticacao) values(?,?,"google")';
    const getUserIdQuery = 'select * from Usuario where Email=?';   
    if(req.body.isNewUser) {
        mySqlConnection.query(googleUserInsertQuery, [userData.username, userData.email], (err: QueryError | null, results: any) => {
            createTokens(res, results);
        });
    }
    else {
        mySqlConnection.query(getUserIdQuery, [userData.email], (err: QueryError | null, results: any) => {
            createTokens(res, results);
        });
    }
})

export {userRouter};