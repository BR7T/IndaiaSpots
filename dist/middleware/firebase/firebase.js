"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCheckVerification = exports.checkGoogleToken = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseCredentials = require("../../../serviceAccountKey.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(firebaseCredentials)
});
function checkGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(response => {
            if (response.error_description == "Invalid Value")
                return false;
            else {
                return true;
            }
        });
    });
}
exports.checkGoogleToken = checkGoogleToken;
function appCheckVerification(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const appCheckToken = req.header('X-Firebase-AppCheck');
        if (!appCheckToken) {
            return res.status(401).send('Unauthorized');
        }
        try {
            yield firebase_admin_1.default.appCheck().verifyToken(appCheckToken);
            return next();
        }
        catch (err) {
            return res.status(401).send('Unauthorized: Invalid AppCheck token.');
        }
    });
}
exports.appCheckVerification = appCheckVerification;
