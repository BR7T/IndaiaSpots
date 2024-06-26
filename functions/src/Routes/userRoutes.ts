import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { userData } from '../types/userData';
import { comparePassword, hashPassword } from '../middleware/bcrypt/hashing';
import { mySqlConnection } from '../middleware/db/mysql';
import { createTokens } from '../middleware/jwt/jwtImplementation';
import { addNewUser, addNewUserGoogle, addNewUserRestaurant, populateUserDataObject } from '../user/addUser';
import { getUserByEmail, getUserIdByEmail } from '../user/getUser';
import { checkIfUsernameOrEmailAlreadyTaken } from '../user/addUser';
import { appCheckVerification } from '../middleware/firebase/firebase';
import { deleteUserByEmail } from '../user/deleteUser';


const userRouter: Router = express.Router();

userRouter.post('/signin',appCheckVerification ,async function (req: Request, res: Response, next: NextFunction) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);

    getUserByEmail(mySqlConnection, userData.email, next).then(async (results) => {
        if (results.length == 0) res.send({ error: "email ou senha inválidos" });
        else {
            if (typeof results[0] === 'object' && 'Senha' in results[0] && typeof results[0].Senha === 'string') {
                await comparePassword(req.body.password, results[0].Senha).then((isPasswordEqual) => {
                    req.body.User = results[0];
                    if (!isPasswordEqual) {
                        res.send({ error: "email ou senha inválidos" });
                    }
                    else {
                        createTokens(req, res, next);
                    }
                })
            }   
        }
    })
})

userRouter.post('/signup', appCheckVerification,  async function (req: Request, res: Response, next: NextFunction) {
    if (req.body.confirmPassword.length < 8) {
        res.status(400).send({ error: "password must have 8 or more characters" });
    }

    const permissionLevel = "Comum";
    let hashedPassword: string = await hashPassword(req.body.confirmPassword, 12);
    const userData: userData = {
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        permissionLevel: permissionLevel
    }
    addNewUser(mySqlConnection, userData, res, next).then(response => {
   }) 
});

userRouter.post('/signupRestaurant', appCheckVerification,  async function (req: Request, res: Response, next: NextFunction) {
    if (req.body.confirm.length < 8) {
        res.status(400).send({ error: "password must have 8 or more characters" });
    }

    const permissionLevel = "Restaurante";
    let hashedPassword: string = await hashPassword(req.body.confirm, 12);
    const userData: userData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        permissionLevel: permissionLevel
    }
    addNewUserRestaurant(mySqlConnection, userData).then(() => {
        getUserIdByEmail(mySqlConnection, userData.email).then(response => {
            res.send({process : true, restaurantId : response})
        })
    })
});

userRouter.use(checkIfUsernameOrEmailAlreadyTaken);

userRouter.post('/googleSignIn', appCheckVerification , async function (req: Request, res: Response, next: NextFunction) {
    const permissionLevel = "Comum";
    const userData = populateUserDataObject(req, permissionLevel);
    if (req.body.isNewUser) {
        addNewUserGoogle(mySqlConnection, userData).then(() => {
            getUserByEmail(mySqlConnection, userData.email, next).then((results) => {
                req.body.User = results[0];
                createTokens(req, res, next);
            })
        });
    }
    else {
        getUserByEmail(mySqlConnection, userData.email , next).then(results => {
            req.body.User = results[0];
            createTokens(req, res, next);
        })
    }
})

userRouter.post('/delete', async function (req: Request, res: Response, next: NextFunction) {
    if(!req.query.email) res.send(500);
    deleteUserByEmail(mySqlConnection , req.query.email).then(response => {
        res.send({process : true});
    })
})

userRouter.use((err : string ,req : Request, res : Response , next : NextFunction) : void => {
    res.status(500).send('Something went wrong');
})

export { userRouter };