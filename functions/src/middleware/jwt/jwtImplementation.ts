import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const jwtSecret = require("../../../jwtSecret.json");

export function isTokenValid(req : any) {
    if(!req.cookies.__session) {
        return false;
    }
    const decoded = jwt.verify(req.cookies.__session.toString(), jwtSecret.key);
    if(!decoded) {
        return false;
    }
    return true;
}

function createToken(id : any) {
    const token = jwt.sign({userId : id},jwtSecret.key, {expiresIn : '30d'});
    return token;
}

export function createTokens(req : Request, res : Response , next : NextFunction) {
    const token = createToken(req.body.User.ID_Usuario);
    res.cookie('__session',[token], {secure : true, httpOnly : true, path: '/', maxAge: 30 * 60 * 60 * 1000, sameSite : 'none'});
    res.send({Accepted : true});
}

