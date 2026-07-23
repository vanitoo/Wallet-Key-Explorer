# Changelog

Все заметные изменения проекта фиксируются в этом файле.

Формат основан на Keep a Changelog, версии следуют Semantic Versioning.

## [Unreleased]

### Planned

- shared public-object codecs and stable diagnostics;
- parser tests, fuzzing and security limits;
- additional descriptor types;
- Extended Key, Address, Script, Transaction and PSBT Inspectors;
- Signature and Miniscript inspection.

## [0.4.0] — 2026-07-23

### Breaking changes

- назначение проекта закреплено как анализ существующих публичных криптографических объектов Bitcoin;
- wallet lifecycle, seed handling and recovery workflows окончательно исключены из проекта;
- дальнейшее переименование репозитория вынесено в отдельный этап.

### Removed

- Wallet Explorer из интерфейса и плана развития;
- Backup Center и wallet-package export из product direction;
- задачи по seed, mnemonic, entropy, wallet generation and recovery;
- derivation-path scanning, balance discovery, signing and broadcasting из границ проекта;
- legacy `src/features` implementation после миграции в `src/modules`;
- wallet-management формулировки из metadata и главного интерфейса.

### Changed

- `src/modules` закреплён как единственная feature-архитектура;
- Multisig Builder позиционируется как **Multisig Policy Builder**;
- Descriptor Explorer позиционируется как **Descriptor Inspector**;
- README, TODO, ROADMAP и ARCHITECTURE перестроены вокруг extended keys, descriptors, multisig policies, addresses, scripts, transactions, PSBT, signatures and Miniscript;
- UI подчёркивает режим `PUBLIC OBJECTS ONLY`;
- версия интерфейса повышена до 0.4.0.

### Security

- mnemonic, seed, entropy, WIF and private extended keys определены как запрещённые входные домены;
- private object detection разрешён только для безопасного отказа;
- core analyzers закреплены как offline-first и network-independent;
- новые модули обязаны иметь input limits, negative tests and explicit diagnostics.

## [0.3.0] — 2026-07-22

### Added

- рабочий Descriptor Explorer;
- импорт `wsh(sortedmulti(...))`;
- Bitcoin Core descriptor checksum;
- threshold, fingerprints, origins and branches;
- network, BIP-48, branch and SLIP-132 diagnostics;
- Health Score;
- Demo Mode на искусственных public keys;
- direct Multisig Builder → Descriptor Explorer handoff.

### Changed

- состояние инструментов сохраняется при переключении вкладок.

## [0.2.0] — 2026-07-22

### Added

- Base58Check extended-key parsing;
- checksum and version-byte validation;
- `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- rejection of private extended keys;
- BIP-32 field inspection;
- multisig presets and receive/change descriptors;
- GitHub Actions.

## [0.1.0] — 2026-07-22

### Added

- Next.js application;
- initial Multisig Builder;
- Mainnet and Testnet;
- N-of-M policies for 2–5 signers;
- public fingerprint, origin path and extended public key input;
- `wsh(sortedmulti(...))` generation.
