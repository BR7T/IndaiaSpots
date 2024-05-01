import * as jwt from 'jsonwebtoken';
import * as jwtSecret from '../../../jwtSecret.json';

export function isTokenValid(request) {
    if(!request.cookies.authorization) {
        return false;
    }
    const decoded = jwt.verify(request.cookies.authorization.toString(), jwtSecret.key);
    if(!decoded) {
        return false;
    }
    return true;
}

export function createTokens(req, res , next) {
    const token = jwt.sign({userId : req.user.ID_Usuario},jwtSecret.key, {'expiresIn' : '1h'});
    const refreshToken = jwt.sign({userId : req.user.ID_Usuario},jwtSecret.key, {'expiresIn' : '30d'});
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