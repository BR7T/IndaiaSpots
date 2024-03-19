export function verify(request,jwt,jwtSecret) {
    if(request.cookies.authorization1) {
        const decoded = jwt.verify(request.cookies.authorization1, jwtSecret.key);
        if(decoded) {
            return true;
        }
    }
    else {
        return false;
    }
}