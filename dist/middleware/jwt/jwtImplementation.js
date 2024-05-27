"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokens = exports.decodeJwt = exports.isTokenValid = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const jwtSecret = require("../../../jwtSecret.json");
function isTokenValid(req) {
    if (!req.cookies.__session) {
        return false;
    }
    const decoded = jwt.verify(req.cookies.__session.toString(), jwtSecret.key);
    if (!decoded) {
        return false;
    }
    return true;
}
exports.isTokenValid = isTokenValid;
function decodeJwt(cookie) {
    const decoded = jwt.verify(cookie.toString(), jwtSecret.key);
    return decoded;
}
exports.decodeJwt = decodeJwt;
function createToken(id) {
    const token = jwt.sign({ userId: id }, jwtSecret.key, { expiresIn: '30d' });
    return token;
}
function createTokens(req, res, next) {
    const token = createToken(req.body.User.ID_Usuario);
    res.cookie('__session', [token], { secure: true, httpOnly: true, path: '/', maxAge: 30 * 60 * 60 * 1000, sameSite: 'none' });
    res.send({ Accepted: true });
}
exports.createTokens = createTokens;
