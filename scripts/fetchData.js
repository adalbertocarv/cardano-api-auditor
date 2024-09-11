const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Função para capturar dados e gerar o hash
async function fetchAndHashData() {
    try {
        const response = await axios.get('https://www.sistemas.dftrans.df.gov.br/service/gps/operacoes');
        const data = response.data;

        // Converte JSON para string e gera o hash
        const jsonString = JSON.stringify(data);
        const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
        
        // Escreve o hash no arquivo de metadata
        const metadata = {
            "721": {
                "API_audit": {
                    "hash": hash
                }
            }
        };

        const metadataPath = path.join(__dirname, '../data/metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log('Dados capturados e hash gerado:', hash);
        return { data, hash };
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

module.exports = fetchAndHashData;
