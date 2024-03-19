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
exports.compare = exports.hashPassword = void 0;
const bcrypt = require('bcrypt');
function hashPassword(password, saltRounds) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt.hash(password, saltRounds);
        return hash;
    });
}
exports.hashPassword = hashPassword;
function compare(string1, string2) {
    return __awaiter(this, void 0, void 0, function* () {
        bcrypt.compare(string1, string2, function (err, resp) {
            if (err) {
                throw Error('comparison failed');
            }
            else if (resp) {
                return true;
            }
            else {
                return false;
            }
        });
    });
}
exports.compare = compare;
