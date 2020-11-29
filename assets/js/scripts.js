const matrizNumeros = {
    '0': ['on', 'on', 'on', '', 'on', 'on', 'on'],
    '1': ['', '', 'on', '', '', '', ''],
    '2': ['on', '', 'on', 'on', '', 'on', 'on'],
    '3': ['on', '', 'on', 'on', 'on', '', 'on'],
    '4': ['', 'on', 'on', 'on', 'on', '', ''],
    '5': ['on', 'on', '', 'on', 'on', 'on', ''],
    '6': ['on', 'on', '', 'on', 'on', 'on', 'on'],
    '7': ['on', '', 'on', '', 'on', '', ''],
    '8': ['on', 'on', 'on', 'on', 'on', 'on', 'on'],
    '9': ['on', 'on', 'on', 'on', 'on', 'on', ''],
};
async function loadApi(method = 'GET', url, data) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Acces-Control-Origin': url,
            }
        }).catch(() => {
            return {
                stautsCode: 502,
                message: 'Erro ao fazer a requisição'
            };
        });
        if (response.stautsCode === 502) {
            throw new Error(response.message);
        } else {
            return response;
        }
    } catch(erro) {
        return {
            stautsCode: 502,
            message: erro
        };
    }
}

async function loadNumber() {
    const resposta = {};
    const messageBox = document.getElementById('retornoNumero');
    loadApi(undefined, 'http://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300').then((data) => {
        if (data.status === 200) {
            return data;
        }
        throw new Error(data.message);
    }).catch(erro => {
        resposta.status = actualNumber;
        messageBox.classList.add('fail');
        messageBox.innerHTML = '<p>Erro</p>';
        setNumero(502)        
    })
}

function setNumero(numero) {
    const elementLetreiro = document.getElementById('number');
    const digitos = elementLetreiro.children;
    const numeroString = numero.toString();
    const numerosDigitos = [];
    const totalDigitosnumero = numeroString.length;
    for (let index = 0; index < digitos.length; index++) {  
        digitos[index].classList.add('show');
        numerosDigitos.push(+numeroString.charAt(index));
    }
    numerosDigitos.forEach(async (numero, index) => {
        console.log('numer ', numero);
        const elementosDigito = digitos[index].children.length;
        console.log('elementos ', elementosDigito)
        for (let idx = 0; idx < elementosDigito; idx++) {
            const element = digitos[index].children[idx];
            console.log('matrix ', index)
            if (matrizNumeros[numero][idx] === 'on') {
                await element.classList.add('on');
            } else {
                await element.classList.remove('on');
            }            
        }
    })
}

let actualNumber; 


