import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';
const firebaseCredentials = require("../../../serviceAccountKey.json");

admin.initializeApp({
    credential : admin.credential.cert(firebaseCredentials)
})

export async function firebaseAppCheck(req: Request, res: Response ,next : NextFunction) {
    if(!req.headers["x-firebase-appcheck"]) {
        res.status(401).send('Unathorized');
    }
    else {
        const appCheckToken : any = req.headers["x-firebase-appcheck"];
        try {
          await admin.appCheck().verifyToken(appCheckToken);
          next();
        } catch (error) {
          console.error("Error verifying token:", error);
          res.status(401).send("Unauthorized");
        }
    }
}

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

export async function appCheckVerification(req : Request, res : Response, next : NextFunction) {
    const appCheckToken = req.header('X-Firebase-AppCheck');
    
    if (!appCheckToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        await admin.appCheck().verifyToken(appCheckToken);
        return next();
    } catch (err) {
        console.error('Error verifying AppCheck token:', err);
        return res.status(401).send('Unauthorized: Invalid AppCheck token.');
    }
}

