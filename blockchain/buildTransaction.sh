#!/bin/bash

# Definir variáveis de entrada
TX_IN="<TX_IN>"                 # UTXO input
ENDERECO_DESTINO="<ENDERECO_DESTINO>" # Endereço Cardano para onde vai a transação
VALOR="<VALOR>"                 # Quantidade de ADA a ser enviada
FEE="<FEE>"                     # Taxa da transação
METADATA_FILE="../data/metadata.json" # Metadata com o hash dos dados
KEY_FILE="../blockchain/keys/payment.skey"  # Chave privada para assinar a transação
OUT_FILE="../blockchain/tx.raw" # Transação não assinada
SIGNED_FILE="../blockchain/tx.signed" # Transação assinada

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
