// INPUTS
let cargaDistribuida = 0;
let cargaConcentrada = 0;
let tensaoMaxima = 0;
let limiteescoamento = 0;
let moduloElasticidadeBC = 0;
let moduloElasticidadeDE = 0;
let l3 = 0;
let l4 = 0;
let l5 = 0;
let l1 = 0;
let l2 = 0;
let tensaoDE = 0;
let tensaoBC = 0;
let diametroBC = 0;
let diametroDE = 0;
let areaBC = 0;
let areaDE = 0;
let fatorSeguranca = 0;

// OUTPUTS
let RA = 0;
let RB = 0;
let RD = 0;
let dA = 0;
let dC = 0;
let dE = 0;
let dF = 0;
let deltaBC = 0;
let deltaDE = 0;

//função principal para calcular, ativada quando o botão é apertado
let calculate = () => {
  getInputValues();
  if (checkForNullOrNegativeValues()) {
    errorRoutine();
    return;
  }
  if (applyEquations()) {
    setOutputs();
    showOutput();
  }
  else {
    errorRoutine();
    return;
  }
}

//Essa função pega os valores inputados no html
let getInputValues = () => {
  cargaDistribuida = parseFloat(
    document.querySelector('#carga-distribuida').value
  );
  cargaConcentrada = parseFloat(
    document.querySelector('#carga-concentrada').value
  );
  limiteescoamento = parseFloat(document.querySelector('#limite-escoamento').value * 1000000);
  moduloElasticidadeBC = parseFloat(
    document.querySelector('#modulo-elasticidade-b-c').value * 1000000000
  );
  moduloElasticidadeDE = parseFloat(
    document.querySelector('#modulo-elasticidade-d-e').value * 1000000000
  );
  l3 = parseFloat(document.querySelector('#distancia-a-c').value);
  l4 = parseFloat(document.querySelector('#distancia-c-e').value);
  l5 = parseFloat(document.querySelector('#distancia-e-f').value);
  l1 = parseFloat(document.querySelector('#comprimento-b-c').value);
  l2 = parseFloat(document.querySelector('#comprimento-d-e').value);
  fatorSeguranca = parseFloat(document.querySelector('#fator-seguranca').value);
  diametroBC = parseFloat(document.querySelector('#diametro-b-c').value);
  diametroDE = parseFloat(document.querySelector('#diametro-d-e').value);
};

let applyEquations = () => {
  areaBC = (Math.PI * diametroBC * diametroBC) / 4;
  areaDE = (Math.PI * diametroDE * diametroDE) / 4;

  let RDNumerador =
    2 * cargaConcentrada * (l3 + l4) +
    cargaDistribuida * l3 * l3 +
    2 * cargaDistribuida * (l4 + l5) * (2 * l3 + l4 + l5);

  let RDDenominador =
    2 *
    ((areaBC* moduloElasticidadeBC * l2 * Math.pow(l3, 2)) / (areaDE * moduloElasticidadeDE * l1 * (l3 + l4)) + (l3 + l4));

  RD = RDNumerador / RDDenominador;

  console.log(`areaBC: ${areaBC}`);
  console.log(`areaDE: ${areaDE}`);
  console.log(`Numerador: ${RDNumerador}`);
  console.log(`Denominador: ${RDDenominador}`);

  RB = (RD * moduloElasticidadeBC * areaBC * l2 * l3) / ( moduloElasticidadeDE * areaDE * l1 * (l3 + l4));
  RA = cargaDistribuida * (l3 + 2 * l4 + 2 * l5) + cargaConcentrada - RB - RD;
  deltaBC = (RB * l1) / (moduloElasticidadeBC * areaBC);
  deltaDE = (RD * l2) / (moduloElasticidadeDE * areaDE);
  dA = 0;
  dC = deltaBC;
  dE = deltaDE;
  dF = (deltaBC * (l3 + l4 + l5)) / l3;
  tensaoBC = RB / areaBC;
  tensaoDE = RD / areaDE;
  tensaoMaxima = limiteescoamento / fatorSeguranca;
  if (checkForRuptures()) return false;
  return true;
};

let setOutputs = () => {
  document.getElementById('reacao-ponto-a').innerHTML = RA.toFixed(4);
  document.getElementById('reacao-ponto-b').innerHTML = RB.toFixed(4);
  document.getElementById('reacao-ponto-d').innerHTML = RD.toFixed(4);
  document.getElementById('deslocamento-ponto-a').innerHTML = (dA * 1000).toFixed(4);
  document.getElementById('deslocamento-ponto-c').innerHTML = (dC * 1000).toFixed(4);
  document.getElementById('deslocamento-ponto-e').innerHTML = (dE * 1000).toFixed(4);
  document.getElementById('deslocamento-ponto-f').innerHTML = (dF * 1000).toFixed(4);
  document.getElementById('deformacao-cabo-b-c').innerHTML = (deltaBC * 1000).toFixed(4);
  document.getElementById('deformacao-cabo-d-e').innerHTML = (deltaDE * 1000).toFixed(4);
  document.getElementById('tensao-cabo-b-c').innerHTML = (tensaoBC / 1000000).toFixed(4);
  document.getElementById('tensao-cabo-d-e').innerHTML = (tensaoDE / 1000000).toFixed(4);
};

let checkForRuptures = () => {
  if (tensaoBC > tensaoMaxima) {
    showErrorMsg(`Tensão no cabo BC maior que a tensão máxima suportada pelo cabo!`);
    return true;
  }
  if (tensaoDE > tensaoMaxima) {
    showErrorMsg(`Tensão no cabo DE maior que a tensão máxima suportada pelo cabo!`);
    return true;
  }
};

// mostra a lista de outputs após calcular
let showOutput = () => {
  document.querySelector('.output-section').classList.remove('d-none');
  window.scrollTo(0, document.body.scrollHeight);
};

// esconde a lista de outputs
let hideOutput = () => {
  showOutput();
  document.querySelector('.output-section').classList.add('d-none');
  document.documentElement.scrollTop = 0;
};

// error routine, reseta a pagina para as condições iniciais
let errorRoutine = () => {
  hideOutput();
  resetInputs();
  resetOutputs();
};

let resetInputs = () => {
  cargaDistribuida = 0;
  cargaConcentrada = 0;
  tensaoMaxima = 0;
  moduloElasticidadeDE = 0;
  moduloElasticidadeBC = 0;
  l3 = 0;
  l4 = 0;
  l5 = 0;
  l1 = 0;
  l2 = 0;
  tensaoDE = 0;
  tensaoBC = 0;
  diametroBC = 0;
  diametroDE = 0;
  areaBC = 0;
  areaDE = 0;
  fatorSeguranca = 0;
};

let resetOutputs = () => {
  RA = 0;
  RB = 0;
  RD = 0;
  dA = 0;
  dC = 0;
  dE = 0;
  dF = 0;
  deltaBC = 0;
  deltaDE = 0;
};

// confere se não tem nenhum campo com valor negativo ou sem valor atribuido
let checkForNullOrNegativeValues = () => {
  if (!cargaDistribuida || cargaDistribuida < 0) {
    showErrorMsg(`Valor da Carga Ditribuida não pode ser negativo ou nulo!`);
    return true;
  }
  if (!cargaConcentrada || cargaConcentrada < 0) {
    showErrorMsg(`Valor da Carga Concentrada não pode ser negativo ou nulo!`);
    return true;
  }
  if (!limiteescoamento || limiteescoamento < 0) {
    showErrorMsg(
      `Valor do Limite de Escoamento não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!moduloElasticidadeBC || moduloElasticidadeBC < 0) {
    showErrorMsg(
      `Valor do Módulo de Elasticidade do cabo BC não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!moduloElasticidadeDE || moduloElasticidadeDE < 0) {
    showErrorMsg(
      `Valor do Módulo de Elasticidade do cabo BC não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!l3 || l3 < 0) {
    showErrorMsg(
      `Valor da distância entre A e C não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!l4 || l4 < 0) {
    showErrorMsg(
      `Valor da distância entre C e E não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!l5 || l5 < 0) {
    showErrorMsg(
      `Valor da distância entre E e F não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!l1 || l1 < 0) {
    showErrorMsg(
      `Valor do comprimento do cabo BC não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!l2 || l2 < 0) {
    showErrorMsg(
      `Valor do comprimento do cabo DE não pode ser negativo ou nulo!`
    );
    return true;
  }
  if (!fatorSeguranca || fatorSeguranca < 0) {
    showErrorMsg(`Valor do Fator de Segurança não pode ser negativo ou nulo!`);
    return true;
  }
  if (!diametroBC || diametroBC < 0) {
    showErrorMsg(`Valor do Diâmetro do cabo BC não pode ser negativo ou nulo!`);
    return true;
  }
  if (!diametroDE || diametroDE < 0) {
    showErrorMsg(`Valor do Diâmetro do cabo DE não pode ser negativo ou nulo!`);
    return true;
  }

  return false;
};

// função simples para mostrar uma mensagem com o erro
let showErrorMsg = (messageText) => {
  alert(`ERRO: ${messageText}`);
};

let insertTestValues = () => {
  document.querySelector('#carga-distribuida').value = 4000;
  document.querySelector('#carga-concentrada').value = 1000;
  document.querySelector('#limite-escoamento').value = 250;
  document.querySelector('#modulo-elasticidade-b-c').value = 200;
  document.querySelector('#modulo-elasticidade-d-e').value = 200;
  document.querySelector('#distancia-a-c').value = 3;
  document.querySelector('#distancia-c-e').value = 2;
  document.querySelector('#distancia-e-f').value = 2;
  document.querySelector('#comprimento-b-c').value = 3;
  document.querySelector('#comprimento-d-e').value = 4;
  document.querySelector('#fator-seguranca').value = 2.5;
  document.querySelector('#diametro-b-c').value = 0.02;
  document.querySelector('#diametro-d-e').value = 0.02;
};
