"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
function verify(request, jwt, jwtSecret) {
    if (request.cookies.authorization1) {
        const decoded = jwt.verify(request.cookies.authorization1, jwtSecret.key);
        if (decoded) {
            return true;
        }
    }
    else {
        return false;
    }
}
exports.verify = verify;
