import * as jwt from 'jsonwebtoken';
import * as jwtSecret from '../../../jwtSecret.json';

export function isTokenValid(req) {
    if(!req.cookies.authorization) {
        return false;
    }
    const decoded = jwt.verify(req.cookies.authorization.toString(), jwtSecret.key);
    if(!decoded) {
        return false;
    }
    return true;
}

function createToken(id, expireTime) {
    const token = jwt.sign({userId : id},jwtSecret.key, {'expiresIn' : expireTime});
    return token
}

export function createTokens(req, res , next) {
    const token = createToken(req.user.ID_Usuario, '1h');
    const refreshToken = createToken(req.user.ID_Usuario, '30d');
    res.cookie('authorization',[token], {secure : true, httpOnly : true}).cookie('refreshToken',[refreshToken], {secure : true, httpOnly : true});
    res.send({Accepted : true});
}

export function refreshToken(req,res, next) {
    if(!req.cookies.refreshToken) {
        res.status(401);
    }
    const decoded : any = jwt.verify(req.cookies.refreshToken.toString(),jwtSecret.key);
    const token = jwt.sign({userId : decoded.userId},jwtSecret.key, {'expiresIn' : '1h'});
    res.cookie('authorization',[token], {secure : true, httpOnly : true});
    res.status(200);
}