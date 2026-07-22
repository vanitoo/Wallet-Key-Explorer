# Wallet Key Explorer

Offline tools for Bitcoin wallet key, descriptor and multisig inspection.

## Current module

- Multisig Builder for Bitcoin P2WSH `wsh(sortedmulti(...))`
- Mainnet and Testnet
- 2–5 signers
- Fingerprint, derivation path and extended public key input
- Duplicate key warnings
- Descriptor generation and copy

## Run locally

```bash
npm install
npm run check
npm run dev
```

Open `http://localhost:3200`.

## Safety

Do not enter seed phrases, xprv or other private keys. The current builder works only with public wallet data.

## Roadmap

- Strong extended-key parsing and network validation
- Descriptor import and validator
- Descriptor checksum
- Receive/change descriptors
- Sparrow export
- Backup package
- PSBT inspector
- Wallet Explorer
