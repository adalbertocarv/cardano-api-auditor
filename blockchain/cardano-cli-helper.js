const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper para construir a transação
function buildTransaction(txIn, txOut, fee, metadataFile, outputFile) {
    try {
        const cmd = `cardano-cli transaction build-raw --tx-in ${txIn} --tx-out ${txOut}+${fee} --metadata-json-file ${metadataFile} --out-file ${outputFile}`;
        execSync(cmd);
        console.log('Transação construída com sucesso!');
    } catch (error) {
        console.error('Erro ao construir a transação:', error);
    }
}

// Helper para assinar a transação
function signTransaction(txBodyFile, signingKeyFile, signedFile) {
    try {
        const cmd = `cardano-cli transaction sign --tx-body-file ${txBodyFile} --signing-key-file ${signingKeyFile} --out-file ${signedFile}`;
        execSync(cmd);
        console.log('Transação assinada com sucesso!');
    } catch (error) {
        console.error('Erro ao assinar a transação:', error);
    }
}

// Helper para submeter a transação
function submitTransaction(signedFile) {
    try {
        const cmd = `cardano-cli transaction submit --tx-file ${signedFile} --testnet-magic 1097911063`;
        execSync(cmd);
        console.log('Transação submetida com sucesso!');
    } catch (error) {
        console.error('Erro ao submeter a transação:', error);
    }
}

module.exports = {
    buildTransaction,
    signTransaction,
    submitTransaction
};
