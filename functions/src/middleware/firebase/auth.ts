import admin from 'firebase-admin';
const firebaseCredentials = require("../../../serviceAccountKey.json");

admin.initializeApp({
    credential : admin.credential.cert(firebaseCredentials)
})

export async function checkGoogleToken(token : string) : Promise<any> {
    await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json()).then(response => {
        if(response.error_description == "Invalid Value") return false
        else {
            return true
        }
    });
}

