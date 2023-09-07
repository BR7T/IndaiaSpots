const form = document.getElementById("formSignup");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formMessage = document.getElementById('formMessage');
const formInputs = document.getElementsByClassName('inputs');

function saidaenter(){
    let botao = document.getElementById('enter');
    botao.classList.add('nada')
}

function resetForm() {
    setTimeout(function() {
        username.value = "";
        email.value = "";
        password.value = "";
    },500);
}

function resetInputStyle() {
    for(let i = 0; i< formInputs.length; i++) {
        formInputs[i].classList.remove('errorInput');
    }
}


form.addEventListener("submit", async function(event) {
    resetInputStyle();
    event.preventDefault();
    
        fetch('http://localhost:3100/signup', {
            method : 'POST',
            body : JSON.stringify({
                username : username.value,
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
                formMessage.innerHTML = response.message;
                formMessage.classList.add('successMessage');
                resetForm();
            }
            else{
                formMessage.innerHTML = response.errorMessage;
                formMessage.classList.add('errorMessage');
                
                inputIndex = response.inputIndex;
                formInputs[inputIndex].style.animation = "none";
                void formInputs[inputIndex].offsetWidth;
                formInputs[inputIndex].style.animation = 'shakeInput 0.2s';
                formInputs[inputIndex].classList.add('errorInput');
            }
        })
        
    });
        





