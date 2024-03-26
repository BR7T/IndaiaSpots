"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.createTokens = exports.isTokenValid = void 0;
function isTokenValid(request, jwt, jwtSecret) {
    if (request.cookies.authorization1) {
        const decoded = jwt.verify(request.cookies.authorization1.toString(), jwtSecret.key);
        if (decoded) {
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
exports.isTokenValid = isTokenValid;
function createTokens(jwt, jwtSecret, response, results) {
    const token = jwt.sign({ userId: results[0].id_usuario }, jwtSecret.key, { 'expiresIn': '1h' });
    const refreshToken = jwt.sign({ userId: results[0].id_usuario }, jwtSecret.key, { 'expiresIn': '1d' });
    response.cookie('authorization1', [token], { secure: true, httpOnly: true }).cookie('refreshToken', [refreshToken], { secure: true, httpOnly: true });
    response.send({ process: 'ok' });
}
exports.createTokens = createTokens;
function refreshToken(req, res, jwt, jwtSecret) {
    if (!req.cookies.refreshToken) {
        res.redirect('/login');
    }
    else {
        const decoded = jwt.verify(req.cookies.refreshToken.toString(), jwtSecret.key);
        const token = jwt.sign({ userId: decoded.userId }, jwtSecret.key, { 'expiresIn': '1h' });
        res.cookie('authorization1', [token], { secure: true, httpOnly: true });
        res.redirect('/home');
    }
}
exports.refreshToken = refreshToken;
