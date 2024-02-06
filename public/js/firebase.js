import {sendEmailVerification, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

export async function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyAGUvffFLk-YZqJKpEhx2CIvF6YKsbJs4I",
        authDomain: "indaiaspots.firebaseapp.com",
        projectId: "indaiaspots",
        storageBucket: "indaiaspots.appspot.com",
        messagingSenderId: "1039724625697",
        appId: "1:1039724625697:web:e4589d3bfc7c02d6700860",
        measurementId: "G-CJ7L3WRBPK"
    }
    await initializeApp(firebaseConfig);
}

const googleProvider = new GoogleAuthProvider();

export function googleAuthInfo(accessToken, email, username, isNewUser) {
    fetch('http://localhost:3100/googleSignIn', {   
        method : 'POST',
        body : JSON.stringify({token : accessToken, email : email, username : username, isNewUser : isNewUser}),
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(response => {
        document.location.href = response.redirect;
    })
}

export async function signinGoogle(){
    const firebaseAuth = getAuth();
    googleProvider.setCustomParameters({prompt: "select_account"});
    signInWithPopup(firebaseAuth,googleProvider).then(result => {
        let credential = "";
        let token = "";
        credential = GoogleAuthProvider.credentialFromResult(result);
        token = credential.accessToken;
        let userInfo = result.user;
        const isNewUser = getAdditionalUserInfo(result).isNewUser;
        const userEmail = userInfo.email;
        const username = userInfo.displayName;
        googleAuthInfo(token,userEmail, username, isNewUser);
    })
}

export async function fetchToServer(route,body) {
    await fetch(`http://localhost:3100/${route}`, {   
            method : 'POST',
            body : body,
            mode: 'cors',
            cache: 'default',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(response => {
            if(route == 'userSignin') {
                if(response.credentials) {
                    document.location.href = response.redirect;
                }
            }
            return response;
        })
    
}

export async function signIn(userData) {
    const firebaseAuth = getAuth();
    await signInWithEmailAndPassword(firebaseAuth, email.value, password.value).then(result => {
        //let credential = GoogleAuthProvider.credentialFromResult(result);
        let userInfo = result.user;
        if(userInfo.emailVerified) {
            fetchToServer('userSignin',userData)
        }
    }) 
}