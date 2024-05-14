import * as jwt from 'jsonwebtoken';
const jwtSecret = "580d15908098e916d2506e4c5c53d7cfb13a8262bd893c55bd72d60f58b48097"
import { Request, Response, NextFunction } from 'express';

export function isTokenValid(req : any) {
    if(!req.cookies.authorization) {
        return false;
    }
    const decoded = jwt.verify(req.cookies.authorization.toString(), jwtSecret);
    if(!decoded) {
        return false;
    }
    return true;
}

function createToken(id : any, expireTime : any) {
    const token = jwt.sign({userId : id},jwtSecret, {'expiresIn' : expireTime});
    return token
}

export function createTokens(req : Request, res : Response , next : NextFunction) {
    const token = createToken(req.body.ID_Usuario, '1h');
    const refreshToken = createToken(req.body.ID_Usuario, '30d');
    res.cookie('authorization',[token], {secure : true, httpOnly : true}).cookie('refreshToken',[refreshToken], {secure : true, httpOnly : true});
    res.send({Accepted : true});
}

export function refreshToken(req : Request, res : Response , next : NextFunction) {
    if(!req.cookies.refreshToken) {
        res.status(401);
    }
    const decoded : any = jwt.verify(req.cookies.refreshToken.toString(),jwtSecret);
    const token = jwt.sign({userId : decoded.userId},jwtSecret, {'expiresIn' : '1h'});
    res.cookie('authorization',[token], {secure : true, httpOnly : true});
    res.status(200);
}