const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const texts = document.getElementById('texts');
const googleIcon = document.getElementById('googleIcon');
const appleIcon = document.getElementById('appleIcon');

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada');
}

let errorMessage = null;
function showErrorMessage(message) {
    if(errorMessage != null) {
        errorMessage.remove();
    }
    errorMessage = document.createElement('p');
    errorMessage.innerHTML = message;
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '1.2rem';
    form.appendChild(errorMessage);
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
            showErrorMessage(res.errorMessage);
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
        //await signupOrLogin('userSignup',userData)
        firebaseSignup(userData.email,userData.password);
    }
    else {
        await signupOrLogin('userSignin',userData)
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


//Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGUvffFLk-YZqJKpEhx2CIvF6YKsbJs4I",
    authDomain: "indaiaspots.firebaseapp.com",
    projectId: "indaiaspots",
    storageBucket: "indaiaspots.appspot.com",
    messagingSenderId: "1039724625697",
    appId: "1:1039724625697:web:e4589d3bfc7c02d6700860",
    measurementId: "G-CJ7L3WRBPK"
}

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: "select_account"});

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
    auth.signInWithPopup(googleProvider).then(result => {
        credential = result.credential;
        token = credential.accessToken;
        let userInfo = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;
        const userEmail = userInfo.email;
        const username = userInfo.displayName;
        googleAuthInfo(token,userEmail, username, isNewUser);
    })
}

googleIcon.addEventListener('click', function() {
    signinGoogle();
})



