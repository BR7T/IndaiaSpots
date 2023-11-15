window.onload = async function(){
    await getEstabs();
    createCards();
}

let boxNome = [];
let boxImage = [];
let boxText = [];

function createCards(){
    boxarea = document.getElementById('box-area')
    for(let i=0; boxNome.length > i;i++){
        
        let geral = document.createElement('article')
        let top = document.createElement('div')
        let bottom = document.createElement('div')
        let h1 = document.createElement('h1')
        let text = document.createElement('p')

        boxarea.appendChild(geral)
        geral.appendChild(top)
        geral.appendChild(bottom)
        bottom.appendChild(h1);bottom.appendChild(text)

        geral.classList.add('geral')
        top.classList.add('top')
        bottom.classList.add('bottom')

        h1.innerHTML = boxNome[i]
        text.innerHTML = boxText[i]
        
        top.style.backgroundImage=`url(${boxImage[i]})`
        top.style.backgroundPosition=`center`
        top.style.backgroundSize='cover'
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