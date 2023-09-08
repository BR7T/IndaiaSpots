const form = document.getElementById("formSignup");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const formMessage = document.getElementById('formMessage');
const formInputs = document.getElementsByClassName('inputs');
const enterBtn = document.getElementById('enter');


function addClass(element,className){
    const elementName = document.getElementById(element);
    elementName.classList.add(className);
}

function resetForm() {
    setTimeout(function() {
        username.value = "";
        email.value = "";
        password.value = "";
    },300);
}

function resetInputsStyle(inputs) {
    for(let i = 0; i< inputs.length; i++) {
        inputs[i].classList.remove('errorInput');
    }
}

function resetAnimation(element) {
    element.style.animation = "none";
    void element.offsetWidth;
}


form.addEventListener("submit", async function(event) {
    event.preventDefault();
    resetInputsStyle(formInputs);
    
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
                resetAnimation(formInputs[inputIndex]);
                formInputs[inputIndex].style.animation = 'shakeInput 0.2s';
                formInputs[inputIndex].classList.add('errorInput');
            }
        })
        
    });
        





