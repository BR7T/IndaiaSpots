const searchInput = document.getElementById('searchInput');

window.onload = async function(){
    await getEstabs();
    createCards();
}

let boxarea = document.getElementById('box-area');
let boxNome = [];
let boxImage = [];
let boxText = [];

function createCards(){
    for(let i=0; boxNome.length > i;i++){
        let geral = document.createElement('article')
        let top = document.createElement('div')
        let bottom = document.createElement('div')
        let h1 = document.createElement('h1')
        let text = document.createElement('p')

        boxarea.appendChild(geral);
        geral.appendChild(top);
        geral.appendChild(bottom);
        bottom.appendChild(h1);
        bottom.appendChild(text);

        geral.classList.add('geral');
        top.classList.add('top');
        bottom.classList.add('bottom');

        h1.innerHTML = boxNome[i]
        text.innerHTML = boxText[i]
        
        top.style.backgroundImage=`url(${boxImage[i]})`;
        top.style.backgroundPosition=`center`;
        top.style.backgroundSize='cover';
    }
}

async function getEstabs() {
    const response = await fetch('http://localhost:3100/getEstabs');
    const results = await response.json();
    for(let i = 0; i < results.length; i++) {
        const data = {
            estabName : results[i].name,
            image : results[i].imageUrl,
            description : results[i].description
        }
        boxImage[i] = [data.image]
        boxNome[i] = [data.estabName]
        boxText[i] = [data.description]
    }
}

async function searchStab(keyword) {
    await fetch('http://localhost:3100/searchEstab',{
        method : 'POST',
        body : JSON.stringify({keyword : keyword}),
        mode: 'cors',
        cache: 'default',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(response => {
        boxarea.innerHTML = "";
        resetArrays([boxImage,boxNome,boxText]);
        for(let i = 0; i < response.length; i++) {
            const data = {
                estabName : response[i].name,
                image : response[i].imageUrl,
                description : response[i].description
                }
            boxImage[i] = [data.image];
            boxNome[i] = [data.estabName];
            boxText[i] = [data.description];
            }
        createCards();
    })
}

function resetArrays(array) {
    for(let i = 0; i < array.length; i++) {
        array[i].length = 0;
    }
}

let timer;
searchInput.addEventListener('input', async function() {
    clearTimeout(timer);
    timer = setTimeout(async function() {
        searchStab(searchInput.value);
    },1000);
})

import {sendEmailVerification, createUserWithEmailAndPassword, getAuth} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import {initializeFirebase,signinGoogle,signIn} from './firebase.js';

initializeFirebase();
let firebaseAuth = getAuth();

let user = firebaseAuth.currentUser;
console.log(user);
