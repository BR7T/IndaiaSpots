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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGoogleToken = void 0;
const admin = require('firebase-admin');
const firebaseCredentials = require("../../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials)
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
            return response;
        });
    });
}
exports.checkGoogleToken = checkGoogleToken;