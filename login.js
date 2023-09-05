const form = document.getElementById('formLogin');
const email = document.getElementById('email');
const password = document.getElementById('password');
const texts = document.getElementById('texts');

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}


form.addEventListener('submit', async function(event) {
    event.preventDefault();

    fetch('http://localhost:3080/login', {
        method : 'POST',
        body : JSON.stringify({
            email : email.value,
            password : password.value
        }), 
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
            window.location.href = "../public/index.html";
        }
        else{
            document.getElementById('errorMessage').innerHTML = response.message;
            email.style.border = '1px solid red';
            email.style.animation = "none";
            void email.offsetWidth;
            email.style.animation = 'errorInput 0.1s linear';
        }
    })
    
})