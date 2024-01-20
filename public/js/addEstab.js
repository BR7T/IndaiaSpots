const form = document.getElementById('form');
const ename = document.getElementById('name');
const imageUrl = document.getElementById('imageUrl');
const description = document.getElementById('description');


let statusMessage = document.createElement('p');

async function postData() {
    const data = JSON.stringify({
        name : ename.value,
        imageUrl : imageUrl.value,
        description : description.value
    })
    
    fetch('http://localhost:3100/addEstab', {
        method : 'POST',
        body : data, 
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then(response => response.json())
    .then(response => {
        statusMessage.removeAttribute('class');
        statusMessage.innerHTML = response.message;
        if(response.query == false) {
            statusMessage.classList.add('failMessage');
            document.body.appendChild(statusMessage);
        }
        else {
            statusMessage.classList.add('successMessage');
            document.body.appendChild(statusMessage);
            form.reset();
        }
    });
}

form.addEventListener('submit', async function(event) {
    event.preventDefault();
    await postData();
})

function formMessage() {
    successElement = document.createElement('p');
    successElement.innerHTML = response.message;
    successElement.classList.add('successMessage');
    document.body.appendChild(successElement);
    form.reset();
}

