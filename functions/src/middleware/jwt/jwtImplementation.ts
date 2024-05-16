import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const jwtSecret = require("../../../jwtSecret.json");

export function isTokenValid(req : any) {
    if(!req.cookies.authorization) {
        return false;
    }
    const decoded = jwt.verify(req.cookies.authorization.toString(), jwtSecret.key);
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
    const refreshToken = createToken(req.body.User.ID_Usuario);
    res.cookie('authorization',[token], {secure : true, httpOnly : true, path: '/', maxAge: 60 * 60 * 1000, sameSite : 'none'});
    res.cookie('refreshToken',[refreshToken], {secure : true, httpOnly : true, path: '/', maxAge: 30 * 60 * 60 * 1000, sameSite : 'none'});
    res.send({Accepted : true});
}

export function refreshToken(req : Request, res : Response , next : NextFunction) {
    if(!req.cookies.refreshToken) {
        res.status(401);
    }
    const decoded : any = jwt.verify(req.cookies.refreshToken.toString(),jwtSecret.key);
    const token = jwt.sign({userId : decoded.userId},jwtSecret.key, {'expiresIn' : '1h'});
    res.cookie('authorization',[token], {secure : true, httpOnly : true});
    res.status(200);
}