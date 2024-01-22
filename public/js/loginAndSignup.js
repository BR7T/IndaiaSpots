const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const texts = document.getElementById('texts');
const buttonTrasition = document.getElementById('button-transition');
const googleIcon = document.getElementById('googleIcon');
const appleIcon = document.getElementById('appleIcon');

import {sendEmailVerification, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";

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
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: "select_account"});

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada');
}

let messageElement = null;
function showMessage(message) {
    if(messageElement != null) {
        messageElement.remove();
    }
    messageElement = document.createElement('p');
    messageElement.innerHTML = message;
    messageElement.style.color = 'red';
    messageElement.style.fontSize = '1.2rem';
    form.appendChild(messageElement);
}

async function fetchToServer(route, body) {
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


async function signupOrLogin(route,body) {
    fetch(`http://localhost:3100/${route}`, {
        method : 'POST',
        body : body,
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json()).then(response => {
        if(response.credentials == false) {
            showMessage(res.errorMessage);
        }
        else if(route == 'userSignin' && response.credentials) {
            document.location.href = response.redirect;
        }
    })
}



let signup = false;
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const userData = JSON.stringify({
        username : username.value,
        email : email.value,
        password : password.value
    })

    if(signup) {
        const response = fetchToServer('checkUserExist',userData).then(async function() {
            if(!response.exists) {
                const userCredentials = await createUserWithEmailAndPassword(auth,email.value,password.value);
                await sendEmailVerification(userCredentials.user);
                form.reset();
                const dbSignup = await fetchToServer('userSignup',userData);
                document.location.href = 'http://localhost:3100/emailVerification';
            }
            else if(response.exists){
                showMessage('Email ou senha já estão em uso');
            }
        })
    }
    else {
        await signInWithEmailAndPassword(auth, email.value, password.value).then(result => {
            credential = GoogleAuthProvider.credentialFromResult(result);
            let userInfo = result.user;
            if(userInfo.emailVerified) {
                const response = fetchToServer('userSignin',userData)
            }
        })  
    }
});


function register(){
    const html = document.documentElement;
    let entra = document.getElementById('button-enter')
    let muda = document.getElementById('mudar-texto')
    let add = document.getElementById('username')
    const TempoAnimacao = '500';
    html.classList.toggle('ir');

    if(html.classList.contains('ir')){
        setTimeout(function(){
            muda.innerHTML= "Seja bem vindo(a)"
            document.querySelector("button").innerHTML='Entrar'
            add.style.display='block'
            entra.value='Cadastre-se'
        },TempoAnimacao)
        signup = true;
    }
    else {
        setTimeout(function(){
            muda.innerHTML= "Bem vindo(a) de volta"
            document.querySelector("button").innerHTML='Cadastrar-se'
            entra.value='Entrar'
            add.style.display='none'
            document.querySelector('footer').style.color='initial '
        },TempoAnimacao)
        signup = false;
    }
}
buttonTrasition.addEventListener('click', register);

//Firebase

function googleAuthInfo(accessToken, email, username, isNewUser) {
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

let credential = "";
let token = "";
async function signinGoogle(){
    signInWithPopup(auth,googleProvider).then(result => {
        credential = GoogleAuthProvider.credentialFromResult(result);
        token = credential.accessToken;
        let userInfo = result.user;
        const isNewUser = getAdditionalUserInfo(result).isNewUser;
        const userEmail = userInfo.email;
        const username = userInfo.displayName;
        googleAuthInfo(token,userEmail, username, isNewUser);
    })
}

googleIcon.addEventListener('click', function() {
    signinGoogle();
})



