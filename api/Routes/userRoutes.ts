import express, {Router, Request, Response} from 'express';
import { userData } from '../types/userData';
import {compare,hashPassword} from '../middleware/bcrypt/hashing';
import {mySqlConnection} from '../middleware/db/mysql';
import {createTokens} from '../middleware/jwt/jwtImplementation';
import { addNewUser, addNewUserGoogle} from '../user/addUser';
import { QueryError } from 'mysql2';
import { populateUserDataObject } from '../user/addUser';
import { checkIfUserExistsByEmail, getUserByEmail } from '../user/getUser';

const userRouter : Router = express.Router();

userRouter.post('/signin', async function(req : Request,res : Response) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);
    
    checkIfUserExistsByEmail(mySqlConnection, userData).then(async (results) => {
        if(results == false) res.send({error : "email ou senha inválidos"});
        else {
            let isPasswordEqual = compare(req.body.password, results[0].Senha);
            if(await isPasswordEqual) res.send({credentials : true });
            else {
                res.send({error : "email ou senha inválidos"});
            }
        }
    })
})

userRouter.post('/signup', async function(req : Request, res : Response) {
    if(req.body.password.length < 8 ) {
        res.status(400).send({error : "password must have 8 or more characters"});
    }

    const permissionLevel = "Comum";
    let hashedPassword : string = await hashPassword(req.body.password,12);
    const userData : userData = {
        username : req.body.name,
        email : req.body.email,
        password : hashedPassword,
        permissionLevel : permissionLevel
    }
    addNewUser(mySqlConnection,userData,permissionLevel,res);
});

userRouter.post('/googleSignIn', async function(req : Request,res :Response) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);  
    if(req.body.isNewUser) {
        addNewUserGoogle(mySqlConnection, userData).then(() => {
            getUserByEmail(mySqlConnection, userData.email).then((results) => {
                createTokens(res, results);
            })
        });
    }
    else {
        getUserByEmail(mySqlConnection, userData.email).then((results) => {
            createTokens(res, results);
        })
    }
})

export {userRouter};