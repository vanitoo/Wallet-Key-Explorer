# Changelog

Все заметные изменения проекта фиксируются в этом файле.

## [Unreleased]

### Added

- unit-test infrastructure based on TypeScript and the built-in Node.js test runner;
- positive coverage for BIP-32 fields of a valid mainnet `xpub`;
- compact validation-result coverage used by Multisig Policy Builder;
- negative coverage for malformed Base58, damaged checksum, unknown version bytes and private extended keys;
- codec tests are now part of `npm run check` and GitHub Actions CI.

### Planned

- Descriptor Inspector v2;
- Address Inspector;
- Script Inspector;
- read-only PSBT Inspector.

## [0.5.0] — 2026-07-23

### Added

- отдельная вкладка Extended Key Inspector;
- Base58Check decode и checksum validation;
- разбор version bytes, network, depth, parent fingerprint и child number;
- hardened child-number indication;
- вывод chain code и key data;
- SLIP-132 interpretation для `ypub`, `zpub`, `upub`, `vpub`;
- JSON diagnostic report и копирование в буфер;
- Demo xpub для безопасной проверки интерфейса.

### Changed

- extended-key logic вынесена в общий `src/modules/common/lib/extended-key.ts`;
- Multisig Policy Builder использует общий validation engine;
- Extended Key Inspector стал первой вкладкой приложения;
- версия приложения повышена до 0.5.0.

### Security

- private extended keys распознаются только для немедленного отказа;
- интерфейс явно запрещает ввод `xprv`, `yprv`, `zprv`, `tprv`, `uprv`, `vprv`;
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
