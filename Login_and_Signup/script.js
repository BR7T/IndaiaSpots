const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const texts = document.getElementById('texts');

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}

function successLogin() {
    window.location.href = "../Home/home.html";
}

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
        return response
    })
}

let signup = false;
let response = '';
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const userData = JSON.stringify({
        username : username.value,
        email : email.value,
        password : password.value
    })
    
    if(signup) {
        await signupOrLogin('signup',userData)
        .then(response => {
            console.log(response);
            if(response.credentials) {
                console.log('Cadastro concluído')
            }
        })
    }
    else {
        await signupOrLogin('login',userData)
        .then(response => response.json()).then(response => console.log(response.credentials))
    }
});



function register(){
    const html = document.documentElement
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



