// Elementos do DOM
const resultado = document.querySelector('#resultado');
const expressao = document.querySelector('#expressao');
const historicoLista = document.querySelector('#historico-lista');

// Estado da calculadora
let valorAtual = '';
let ultimaOperacao = '';
let calculoCompleto = false;

// Funções auxiliares
function adicionarAoHistorico(calculo, resultado) {
    const item = document.createElement('div');
    item.textContent = `${calculo} = ${resultado}`;
    historicoLista.appendChild(item);
    historicoLista.scrollTop = historicoLista.scrollHeight;
}

function formatarNumero(numero) {
    if (Number.isInteger(numero)) {
        return numero.toString();
    }
    return numero.toFixed(8).replace(/\.?0+$/, '');
}

function calcular(expressaoStr) {
    try {
        // Substituir × por * para avaliação
        expressaoStr = expressaoStr.replace(/×/g, '*');
        const resultado = eval(expressaoStr);
        return formatarNumero(resultado);
    } catch (error) {
        return 'Erro';
    }
}

// Event Listeners para números e operadores
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const valor = button.textContent;
        
        if (calculoCompleto && /[0-9]/.test(valor)) {
            limparTudo();
        }
        
        if (/[0-9.]/.test(valor)) {
            if (valor === '.' && resultado.value.includes('.')) return;
            resultado.value += valor;
            calculoCompleto = false;
        } else if (['+', '-', '×', '/'].includes(valor)) {
            if (resultado.value === '' && valor === '-') {
                resultado.value = '-';
            } else if (resultado.value !== '') {
                if (expressao.textContent === '') {
                    expressao.textContent = resultado.value + ' ' + valor;
                    resultado.value = '';
                } else if (!calculoCompleto) {
                    const calculo = expressao.textContent + ' ' + resultado.value;
                    const resultadoCalculo = calcular(calculo);
                    adicionarAoHistorico(calculo, resultadoCalculo);
                    expressao.textContent = resultadoCalculo + ' ' + valor;
                    resultado.value = '';
                } else {
                    expressao.textContent = resultado.value + ' ' + valor;
                    resultado.value = '';
                }
            }
        }
    });
});

// Funcionalidade do botão igual
document.querySelector('#igual').addEventListener('click', () => {
    if (expressao.textContent !== '' && resultado.value !== '') {
        const calculo = expressao.textContent + ' ' + resultado.value;
        const resultadoCalculo = calcular(calculo);
        adicionarAoHistorico(calculo, resultadoCalculo);
        expressao.textContent = '';
        resultado.value = resultadoCalculo;
        calculoCompleto = true;
    }
});

// Funcionalidade do botão limpar
function limparTudo() {
    resultado.value = '';
    expressao.textContent = '';
    calculoCompleto = false;
}

document.querySelector('#limpar').addEventListener('click', limparTudo);

// Funcionalidade do botão backspace
document.querySelector('#backspace').addEventListener('click', () => {
    resultado.value = resultado.value.slice(0, -1);
});

// Funcionalidade do botão inverter sinal
document.querySelector('#inverter').addEventListener('click', () => {
    if (resultado.value !== '') {
        resultado.value = (parseFloat(resultado.value) * -1).toString();
    }
});

// Funcionalidade do botão porcentagem
document.querySelector('#porcentagem').addEventListener('click', () => {
    if (resultado.value !== '') {
        const valor = parseFloat(resultado.value);
        if (expressao.textContent === '') {
            resultado.value = (valor / 100).toString();
        } else {
            const baseValor = parseFloat(expressao.textContent);
            resultado.value = (baseValor * (valor / 100)).toString();
        }
    }
});

// Suporte a teclas do teclado
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', 'Backspace', 'Escape'];
    
    if (validKeys.includes(key)) {
        event.preventDefault();
        if (key === 'Enter') {
            document.querySelector('#igual').click();
        } else if (key === 'Backspace') {
            document.querySelector('#backspace').click();
        } else if (key === 'Escape') {
            document.querySelector('#limpar').click();
        } else if (key === '*') {
            document.querySelector('#multiplicar').click();
        } else {
            const button = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent === key);
            if (button) button.click();
        }
    }
});
