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
