# Wallet Key Explorer

Локальный офлайн-набор инструментов для анализа **публичных криптографических объектов Bitcoin**.

> Текущая версия: **v0.5.0 — Extended Key Inspector**

## Реализовано

### Extended Key Inspector

- Base58Check decode и checksum validation;
- `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- mainnet/testnet;
- version bytes, depth, parent fingerprint и child number;
- hardened flag, chain code и compressed public key;
- SLIP-132 interpretation;
- JSON report;
- обнаружение и немедленный отказ для private extended keys.

### Multisig Policy Builder

- P2WSH `wsh(sortedmulti(...))`;
- политики от 2 до 5 подписантов;
- receive/change descriptors;
- fingerprints, key origins и extended public keys;
- общий extended-key validation engine;
- Demo Mode на искусственных публичных данных.

### Descriptor Inspector

- разбор `wsh(sortedmulti(...))`;
- Bitcoin Core descriptor checksum;
- threshold, signer keys, origins и branches;
- network, BIP-48 и SLIP-132 diagnostics;
- Health Score.

## Граница проекта

Проект не является кошельком и не работает с секретами.

Не поддерживаются mnemonic, entropy, seed, private keys, private extended keys, wallet recovery, balance lookup, signing, finalization и broadcasting.

HD wallet и seed-функциональность находится в **HD Wallet Explorer**.

## Архитектура

```text
src/modules/
  common/lib/extended-key.ts
  extended-key/components/extended-key-inspector.tsx
  multisig/
  descriptor/
```

Общий extended-key codec используется отдельным Inspector и Multisig Policy Builder.

## Запуск

```bash
npm install
npm run check
npm run dev
```

Откройте `http://localhost:3200`.

## Следующие этапы

1. тесты extended-key codec;
2. Descriptor Inspector v2;
3. Address Inspector;
4. Script Inspector;
5. PSBT Inspector.

## Документы

- [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- [`ROADMAP.md`](./ROADMAP.md)
- [`TODO.md`](./TODO.md)
- [`CHANGELOG.md`](./CHANGELOG.md)

## Лицензия

MIT
