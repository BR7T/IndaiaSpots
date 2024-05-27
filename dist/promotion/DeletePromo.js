"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePromo = void 0;
function deletePromo(mySqlConnection, promocaoId) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM Promocoes WHERE ID_Promocoes = ?";
        mySqlConnection.query(query, [promocaoId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve('success');
        });
    });
}
exports.deletePromo = deletePromo;
;
