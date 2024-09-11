const { execSync } = require('child_process');
const path = require('path');

function submitTransaction() {
    try {
        // Caminho do arquivo assinado
        const signedTxPath = path.join(__dirname, 'tx.signed');
        
        // Comando para submeter a transação
        const submitCmd = `cardano-cli transaction submit --tx-file ${signedTxPath} --testnet-magic 1097911063`;

        // Executa o comando
        execSync(submitCmd);
        console.log('Transação submetida com sucesso!');
    } catch (error) {
        console.error('Erro ao submeter transação:', error);
    }
}

module.exports = submitTransaction;
