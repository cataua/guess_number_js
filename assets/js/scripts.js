const messageBox = document.getElementById('retornoNumero');
const btnNewGame = document.getElementById('new-game');
const numberSubmited = document.getElementById('palpite');
const btnSubmit = document.getElementById('send');
const matrizNumeros = {
    '0': ['on', 'on', 'on', '', 'on', 'on', 'on'],
    '1': ['', '', 'on', '', 'on', '', ''],
    '2': ['on', '', 'on', 'on', '', 'on', 'on'],
    '3': ['on', '', 'on', 'on', 'on', 'on', ''],
    '4': ['', 'on', 'on', 'on', 'on', '', ''],
    '5': ['on', 'on', '', 'on', 'on', 'on', ''],
    '6': ['on', 'on', '', 'on', 'on', 'on', 'on'],
    '7': ['on', '', 'on', '', 'on', '', ''],
    '8': ['on', 'on', 'on', 'on', 'on', 'on', 'on'],
    '9': ['on', 'on', 'on', 'on', 'on', 'on', ''],
};
const loadApi = async (method = 'GET', url) => {
        const urlOrigin = url.replace(/^((http|https):\/\/(.)*)(\/){1}(.)*$/gm, `$1`);
        const request = new Request(url, {
            method: method,
            mode: 'cors', 
            cache: 'default',
            headers: {
                'Access-Control-Allow-Origin': urlOrigin,
                'Content-Type': 'application/json',
                'Origin': urlOrigin,
            }
        });
        const resposta = await fetch(request).then((data) => {
            return data}).then((data) => {
                return  data;
            }).catch(() => {
                return {
                stautsCode: 502,
                message: 'Erro ao fazer a requisição'
            };
        });
        if (resposta.stautsCode === 502) {
            const sorteiaNumero = Math.random() < 0.9;
            if (sorteiaNumero) {
                const numero = Math.floor(Math.random() * (Math.floor(300) - Math.ceil(1) + 1)) + Math.ceil(1);
                return {
                    status: 200,
                    number: numero,
                };
            }
            return {
            stautsCode: 502,
            message: resposta.message,
            };
        } else {
            return resposta;
        }
    };

async function loadNumber() {
    const resposta = {};
        const data = await loadApi('GET', 'http://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300').then(resp => resp).catch(erro => erro);
    if (data.status === 200) {
        checaPalpite(data);
    } else {
        resposta.status = actualNumber;
        messageBox.classList.add('fail');
        messageBox.innerHTML = '<p>Erro</p>';
        setNumero(502)        
    };
}

async function setNumero(numero, status = false) {
    const elementLetreiro = document.getElementById('number');
    const digitos = elementLetreiro.children;
    const isErro = (numero === 502)
    const isSucesso = status
    const numeroString = numero.toString();
    const numerosDigitos = [];
    const totalDigitosnumero = numeroString.length;
    await limpaDigitos();
    for (let index = 0; index < totalDigitosnumero; index++) {  
        digitos[index].classList.add('show');
        numerosDigitos.push(+numeroString.charAt(index));
    }
    numerosDigitos.forEach(async (numero, index) => {
        const elementosDigito = digitos[index].children.length;
        for (let idx = 0; idx < elementosDigito; idx++) {
            const element = digitos[index].children[idx];
            if (matrizNumeros[numero][idx] === 'on') {
                await element.classList.add('on');
                if (isErro) {
                    await element.classList.add('fail');
                }
                if (isSucesso) {
                    await element.classList.add('success');
                }
            } else {
                await element.classList.remove('on');
                if (isErro) {
                    await element.classList.remove('fail');
                }
            }            
        }
    });
    if (isErro || isSucesso) {
        btnNewGame.classList.remove('hide');
    }
}

async function novaPartida() {
    messageBox.classList.remove('fail');
    messageBox.classList.remove('success');
    messageBox.innerHTML = '';
    numberSubmited.value = '';
    await limpaDigitos();
    btnNewGame.classList.add('hide');
}

async function checaPalpite(data) {
    if (!actualNumber) {
        actualNumber = data.number;
        await compara(actualNumber, hint);
    } else {
        await compara(actualNumber, hint);
    }
}

async function limpaDigitos() {
    const elementLetreiro = document.getElementById('number');
    const digitos = elementLetreiro.children;
    for (let index = 0; index < 3; index++) {        
        const letreiro = digitos[index];
        const elemento = letreiro.children.length
        for (let idx = 0; idx < elemento; idx++) {
            letreiro.children[idx].classList.remove('on');
            letreiro.children[idx].classList.remove('fail');
            letreiro.children[idx].classList.remove('success');
        };
        letreiro.classList.remove('show');
    }
    digitos[0].classList.add('show');
}

async function acertou() {
    const elementLetreiro = document.getElementById('number');
    const digitos = elementLetreiro.children;
    for (let index = 0; index < 3; index++) {        
        const letreiro = digitos[index];
        for (let idx = 0; idx < digitos.length; idx++) {
            letreiro.children[idx].classList.add('success');
        };
    }
}

async function compara(atual, sugestao) {
    if (parseInt(atual) === parseInt(sugestao) ) {
        messageBox.classList.add('success');
        messageBox.innerHTML = '<p>Você acertou!!!!!!</p>';
        setNumero(atual, true);
        btnNewGame.classList.remove('hide');
        numberSubmited.setAttribute('disabled', 'disabled');
        btnSubmit.setAttribute('disabled', 'disabled');
    } else if (parseInt(atual) < parseInt(sugestao)) {
        messageBox.innerHTML = '<p>É menor</p>';
        numberSubmited.value = '';
        setNumero(sugestao);
    } else if (parseInt(atual) > parseInt(sugestao)) {
        messageBox.innerHTML = '<p>É maior</p>';
        numberSubmited.value = '';
        setNumero(sugestao);
    } else {
        numberSubmited.removeAttribute('disabled');
        btnSubmit.removeAttribute('disabled');
    }
}

btnSubmit.addEventListener('click', () => {
    const sugestao = numberSubmited.value;
    compara(actualNumber, sugestao);
})

btnNewGame.addEventListener('click', () => {
    novaPartida();
    loadNumber();
})

let actualNumber; 
let hint;


