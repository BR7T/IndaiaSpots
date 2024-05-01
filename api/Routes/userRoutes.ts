import express, { Router, Request, Response } from 'express';
import { userData } from '../types/userData';
import { comparePassword, hashPassword } from '../middleware/bcrypt/hashing';
import { mySqlConnection } from '../middleware/db/mysql';
import { createTokens } from '../middleware/jwt/jwtImplementation';
import { addNewUser, addNewUserGoogle, populateUserDataObject } from '../user/addUser';
import { getUserByEmail } from '../user/getUser';
import { checkIfUsernameOrEmailAlreadyTaken } from '../user/addUser';
import { Next } from 'mysql2/typings/mysql/lib/parsers/typeCast';
import { customRequestExtender } from '../types/extendRequestInterface';

const userRouter: Router = express.Router();
customRequestExtender();

userRouter.post('/signin', async function (req: Request, res: Response, next: Next) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);

    getUserByEmail(mySqlConnection, userData.email).then(async (results) => {
        if (results.length == 0) res.send({ error: "email ou senha inválidos" });
        else {
            await comparePassword(req.body.password, results[0].Senha).then((isPasswordEqual) => {
                req.user = results[0];
                if (!isPasswordEqual) {
                    res.send({ error: "email ou senha inválidos" });
                }
                else {
                    createTokens(req, res, next);
                }
            })
        }
    })
})

userRouter.post('/signup', async function (req: Request, res: Response, next: Next) {
    if (req.body.password.length < 8) {
        res.status(400).send({ error: "password must have 8 or more characters" });
    }

    const permissionLevel = "Comum";
    let hashedPassword: string = await hashPassword(req.body.password, 12);
    const userData: userData = {
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        permissionLevel: permissionLevel
    }
    addNewUser(mySqlConnection, userData, permissionLevel, next);
});

userRouter.use(checkIfUsernameOrEmailAlreadyTaken);
userRouter.use((err, req, res, next) => {
    res.status(500).send('Something went wrong');
})

userRouter.post('/googleSignIn', async function (req: Request, res: Response, next: Next) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);
    if (req.body.isNewUser) {
        addNewUserGoogle(mySqlConnection, userData).then(() => {
            getUserByEmail(mySqlConnection, userData.email).then((results) => {
                req.user = results[0];
                createTokens(req, res, next);
            })
        });
    }
    else {
        getUserByEmail(mySqlConnection, userData.email).then((results) => {
            req.user = results[0];
            createTokens(req, res, next);
        })
    }
})

export { userRouter };