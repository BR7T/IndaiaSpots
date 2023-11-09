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

/*function loginErrorMessage() {
    document.getElementById('errorMessage').innerHTML = response.message;
    email.style.border = '1px solid red';
    email.style.animation = "none";
    void email.offsetWidth;
    email.style.animation = 'errorInput 0.1s linear';
}*/

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const userData = JSON.stringify({
        email : email.value,
        password : password.value
    })
    fetch('http://localhost:3100/login', {
        method : 'POST',
        body : userData, 
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json()).then(response => {
        console.log(response);
        if(response.credentials) {
            successLogin();
        }
        /*else{
            loginErrorMessage();
        }*/
    })
    
})

function register(){
    const html = document.documentElement
    let entra = document.getElementById('button-enter')
    let muda = document.getElementById('mudar-texto')
    let add = document.getElementById('adiciona')
    const TempoAnimacao = '500'
    html.classList.toggle('ir');

    if(html.classList.contains('ir')){
        setTimeout(function(){
            muda.innerHTML= "Seja bem vindo(a)"
            document.querySelector("button").innerHTML='Entrar'
            add.style.display='block'
            entra.value='Cadastre-se'

            document.querySelector('footer').style.color='white '
        },TempoAnimacao)

    }
    else{
        setTimeout(function(){
            muda.innerHTML= "Bem vindo(a) de volta"
            document.querySelector("button").innerHTML='Cadastrar-se'
            entra.value='Entrar'
            add.style.display='none'
            document.querySelector('footer').style.color='initial '
        },TempoAnimacao)
    }
}



