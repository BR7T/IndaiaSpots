"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImage = void 0;
function addImage(mySqlConnection, body) {
    const url = `https://d1rz3fbu8zmjz5.cloudfront.net/${body.filename}`;
    const insertQuery = 'insert into Imagem(URL, ID_Restaurante) values (?,?)';
    return new Promise((resolve, reject) => {
        mySqlConnection.query(insertQuery, [url, body.ID_Restaurante], (err, results) => {
            if (err)
                reject(err);
            else {
                resolve('success');
            }
        });
    });
}
exports.addImage = addImage;
