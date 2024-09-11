const fetchAndHashData = require('../scripts/fetchData');
const assert = require('assert');

async function testFetchData() {
    const { data, hash } = await fetchAndHashData();

    assert(data !== null, 'Dados da API não podem ser nulos');
    assert(hash !== null, 'O hash não pode ser nulo');
    console.log('Teste de captura de dados passou com sucesso!');
}

testFetchData();
