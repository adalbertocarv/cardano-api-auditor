Estrutura de diretório limpa e modular que permita fácil manutenção e expansão. Por estar lidando com captura de dados de uma API, geração de hash e interação com a blockchain (Cardano no caso), a estrutura do projeto precisa refletir essas responsabilidades separadamente.

Estrutura de diretório adotada:

```
/cardano-api-auditor
│
├── /blockchain
│   ├── submitTransaction.js         # Código para submeter transações na Cardano Blockchain
│   ├── buildTransaction.sh          # Script Bash para construir a transação
│   ├── cardano-cli-helper.js        # Funções helper para interação com cardano-cli
│   └── keys/
│       ├── payment.skey             # Chave de assinatura (somente exemplo)
│       └── payment.vkey             # Chave pública (somente exemplo)
│
├── /config
│   ├── config.js                    # Configurações gerais do projeto
│   └── cardano-node.json            # Configurações do nó Cardano
│
├── /data
│   ├── metadata.json                # Arquivo temporário de metadata para transação
│   └── gps-data.json                # Dados da API salvos (se necessário)
│
├── /scripts
│   ├── fetchData.js                 # Código para buscar os dados da API e gerar hash
│   └── saveData.js                  # Opcional: código para salvar dados em um banco de dados local
│
├── /test
│   ├── testFetchData.js             # Testes unitários para validação de captura de dados
│   ├── testHashGeneration.js        # Testes unitários para a geração do hash
│   └── testSubmitTransaction.js     # Testes para submissão de transação Cardano
│
├── /logs
│   └── transaction.log              # Arquivo de logs para monitoramento de transações
│
├── package.json                     # Definições do projeto Node.js e dependências
├── README.md                        # Instruções sobre o projeto
└── .gitignore                       # Arquivos a serem ignorados pelo Git
```

### Explicação da Estrutura:

1. **`/blockchain/`**:
    - **submitTransaction.js**: Contém o código responsável por pegar o hash gerado e submetê-lo como metadata na blockchain Cardano.
    - **buildTransaction.sh**: Um script bash para construir e assinar a transação Cardano usando `cardano-cli`.
    - **cardano-cli-helper.js**: Helpers para interagir com o `cardano-cli` de forma programática (construir e submeter transações, verificar o estado da blockchain, etc).
    - **keys/**: Pasta para armazenar as chaves de assinatura necessárias para submeter as transações. **Certifique-se de manter essa pasta fora de qualquer repositório público (GitHub, etc.) e de proteger as chaves privadas.**

2. **`/config/`**:
    - **config.js**: Arquivo onde estarão as configurações gerais do projeto, como o endpoint da API, dados do Cardano, etc.
    - **cardano-node.json**: Arquivo de configuração do nó Cardano, contendo as configurações da rede de testes e outros detalhes relacionados ao blockchain.

3. **`/data/`**:
    - **metadata.json**: Arquivo temporário gerado contendo o hash dos dados que será submetido como metadata na transação.
    - **gps-data.json**: Caso você precise armazenar os dados da API, essa pasta pode ser usada para guardar os JSONs recebidos.

4. **`/scripts/`**:
    - **fetchData.js**: Código responsável por buscar os dados da API, gerar o hash e salvar no arquivo de metadata.
    - **saveData.js**: (Opcional) Se quiser armazenar os dados recebidos da API em um banco de dados ou arquivo, este script lidaria com essa funcionalidade.

5. **`/test/`**:
    - **testFetchData.js**: Testes unitários para garantir que os dados estão sendo capturados corretamente da API.
    - **testHashGeneration.js**: Testes para garantir que o hash gerado é correto e consistente.
    - **testSubmitTransaction.js**: Testes para garantir que as transações estão sendo submetidas corretamente na blockchain.

6. **`/logs/`**:
    - **transaction.log**: Um log onde você pode armazenar informações sobre as transações que foram feitas, status da submissão, etc.

7. **`package.json`**:
    - O arquivo onde são definidas as dependências do projeto, scripts de automação e outras informações do projeto Node.js.

8. **`.gitignore`**:
    - Certifique-se de adicionar as chaves de blockchain privadas e outros arquivos sensíveis a este arquivo para evitar que sejam compartilhados acidentalmente em um repositório público.

### **Código exemplo:**

Aqui está um exemplo do arquivo `fetchData.js`, que captura os dados da API e gera o hash:

```js
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
```

### **Script Bash: `buildTransaction.sh`**

Este script será responsável por construir a transação na Cardano usando o `cardano-cli`:

```bash
#!/bin/bash

# Definir variáveis de entrada
TX_IN="<TX_IN>"
ENDERECO_DESTINO="<ENDERECO_DESTINO>"
VALOR="<VALOR>"
FEE="<FEE>"
METADATA_FILE="../data/metadata.json"
KEY_FILE="../blockchain/keys/payment.skey"
OUT_FILE="../blockchain/tx.raw"
SIGNED_FILE="../blockchain/tx.signed"

# Construir transação com o metadata
cardano-cli transaction build-raw \
    --tx-in $TX_IN \
    --tx-out $ENDERECO_DESTINO+$VALOR \
    --fee $FEE \
    --metadata-json-file $METADATA_FILE \
    --out-file $OUT_FILE

# Assinar a transação
cardano-cli transaction sign \
    --tx-body-file $OUT_FILE \
    --signing-key-file $KEY_FILE \
    --out-file $SIGNED_FILE

# Submeter a transação
cardano-cli transaction submit --tx-file $SIGNED_FILE --testnet-magic 1097911063
```

### **Dependências do projeto (`package.json`):**

```json
{
  "name": "cardano-api-auditor",
  "version": "1.0.0",
  "description": "Sistema de auditoria de API usando Cardano Blockchain",
  "main": "index.js",
  "scripts": {
    "fetch-data": "node scripts/fetchData.js",
    "submit-tx": "bash blockchain/buildTransaction.sh"
  },
  "dependencies": {
    "axios": "^0.21.1",
    "crypto": "latest",
    "fs": "latest"
  }
}
```

### **Próximos passos**:
1. Instalar as dependências do Node.js com `npm install`.
2. Configurar as variáveis corretas no script `buildTransaction.sh` (como `TX_IN`, `ENDERECO_DESTINO`, etc).
3. Executar os scripts de captura de dados e submissão de transação na blockchain.
