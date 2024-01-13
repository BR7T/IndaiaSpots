const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const texts = document.getElementById('texts');

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}

function errorMessage(message) {
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = message;
    errorMessage.style.color = 'red';
    errorMessage.style.fontSize = '1.2rem';
    form.appendChild(errorMessage);
}

let res;
async function signupOrLogin(method,body) {
    fetch(`http://localhost:3100/${method}`, {
        method : 'POST',
        body : body,
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json()).then(response => {
        res = response;
        if(res.credentials == false) {
            errorMessage(res.errorMessage);
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
        await signupOrLogin('signup',userData)
    }
    else {
        await signupOrLogin('loginUser',userData)
    }
});


function register(){
    let entra = document.getElementById('button-enter')
    let muda = document.getElementById('mudar-texto')
    let add = document.getElementById('username')
    const TempoAnimacao = '500'
    html.classList.toggle('ir');

    if(html.classList.contains('ir')){
        setTimeout(function(){
            muda.innerHTML= "Seja bem vindo(a)"
            document.querySelector("button").innerHTML='Entrar'
            add.style.display='block'
            entra.value='Cadastre-se'
            //document.querySelector('footer').style.color='white';
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



