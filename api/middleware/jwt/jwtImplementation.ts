export function isTokenValid(request,jwt,jwtSecret) {
    if(request.cookies.authorization) {
        const decoded = jwt.verify(request.cookies.authorization1.toString(), jwtSecret.key);
        if(decoded) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

export function createTokens(jwt,jwtSecret,response,results) {
    const token = jwt.sign({userId : results[0].ID_Usuario},jwtSecret.key, {'expiresIn' : '1h'});
    const refreshToken = jwt.sign({userId : results[0].ID_Usuario},jwtSecret.key, {'expiresIn' : '30d'});
    response.cookie('authorization',[token], {secure : true, httpOnly : true}).cookie('refreshToken',[refreshToken], {secure : true, httpOnly : true});
    response.send({Accepted : true});
}

export function refreshToken(req,res,jwt,jwtSecret) {
    if(!req.cookies.refreshToken) {
        res.redirect('/login');
    }
    else {
        const decoded = jwt.verify(req.cookies.refreshToken.toString(),jwtSecret.key);
        const token = jwt.sign({userId : decoded.userId},jwtSecret.key, {'expiresIn' : '1h'});
        res.cookie('authorization',[token], {secure : true, httpOnly : true, sameSite : 'None'});
        res.redirect('/home');
    }
}