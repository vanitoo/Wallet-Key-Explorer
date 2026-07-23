# Changelog

Все заметные изменения проекта фиксируются в этом файле.

## [Unreleased]

### Planned

- Script Inspector;
- read-only PSBT Inspector;
- Transaction Inspector.

## [0.6.0] — 2026-07-23

### Added

- отдельная вкладка Address Inspector;
- Base58Check, Bech32 и Bech32m decoding;
- определение Mainnet, Testnet и Regtest;
- распознавание P2PKH, P2SH, P2WPKH, P2WSH и P2TR;
- разбор witness version и witness program;
- построение `scriptPubKey` из введённого адреса;
- demo-векторы и отдельные unit-тесты адресного codec;
- команда `npm run test:address`.

### Security

- Address Inspector работает полностью локально;
- не выполняет запросы баланса, истории транзакций или принадлежности адреса;
- ограничивает размер входных данных и отвергает повреждённые checksum.

## [0.5.0] — 2026-07-23

### Added

- отдельная вкладка Extended Key Inspector;
- Base58Check decode и checksum validation;
- разбор version bytes, network, depth, parent fingerprint и child number;
- hardened child-number indication;
- вывод chain code и key data;
- SLIP-132 interpretation для `ypub`, `zpub`, `upub`, `vpub`;
- JSON diagnostic report и копирование в буфер;
- Demo xpub для безопасной проверки интерфейса;
- Descriptor Inspector v2 with explicit checksum, network and branch statuses;
- strict key-origin and wildcard branch validation for `wsh(sortedmulti(...))`;
- descriptor and extended-key unit-test suites.

### Changed

- extended-key logic вынесена в общий `src/modules/common/lib/extended-key.ts`;
- Multisig Policy Builder использует общий validation engine;
- Extended Key Inspector стал первой вкладкой приложения;
- `npm test` запускает все скомпилированные тестовые наборы.

### Security

- private extended keys распознаются только для немедленного отказа;
- интерфейс запрещает ввод private extended keys;
- Inspector не выполняет derivation и не обращается к сети.

## [0.4.0] — 2026-07-23

### Breaking changes

- удалено wallet/seed/recovery-позиционирование;
- проект закреплён как offline toolkit для публичных Bitcoin-объектов;
- seed, mnemonic, private keys, recovery, balance scanning, signing и broadcasting исключены из scope;
- архитектура переведена на `src/modules`;
- добавлены ARCHITECTURE, ROADMAP и строгая security boundary.

## [0.3.0] — 2026-07-22

- добавлен Descriptor Inspector;
- Bitcoin Core descriptor checksum;
- BIP-48, branch и SLIP-132 diagnostics;
- Health Score;
- Builder → Inspector handoff.

## [0.2.0] — 2026-07-22

- Base58Check validation extended public keys;
- multisig presets;
- receive/change descriptors;
- GitHub Actions.

## [0.1.0] — 2026-07-22

- первоначальный Next.js-проект;
- Multisig Builder;
- `wsh(sortedmulti(...))` descriptors.
