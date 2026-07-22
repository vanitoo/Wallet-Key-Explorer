# Changelog

Все заметные изменения Wallet Key Explorer фиксируются в этом файле.

Формат основан на Keep a Changelog, версии проекта следуют Semantic Versioning.

## [Unreleased]

### Planned

- shared public-object codecs and stable diagnostic codes;
- parser tests and security limits;
- additional descriptor types;
- Extended Key Inspector;
- Address Inspector;
- Script Inspector;
- read-only PSBT Inspector.

## [0.4.0] — 2026-07-23

### Changed

- назначение проекта закреплено как анализ существующих публичных криптографических объектов Bitcoin;
- runtime и metadata больше не позиционируют приложение как wallet explorer или wallet-management tool;
- `src/modules` закреплён как единственная feature-архитектура;
- README и TODO полностью перестроены вокруг extended keys, descriptors, multisig policies, addresses, scripts и PSBT;
- версия проекта повышена до 0.4.0.

### Removed

- старая дублирующая реализация Multisig Builder из `src/features/multisig`;
- Wallet Explorer из интерфейса и плана развития;
- публичный Backup Center как отдельная wallet-oriented подсистема;
- задачи по хранению, восстановлению и экспорту пользовательских wallet packages;
- seed, mnemonic, wallet generation, recovery, balance scanning, signing и broadcasting из границ проекта.

### Added

- `ARCHITECTURE.md` с правилами модулей, зависимостей, парсинга и security boundary;
- `ROADMAP.md` с этапами развития до v1.0;
- строгий список permanently out-of-scope возможностей;
- целевая архитектура для Extended Key, Address, Script и PSBT Inspectors.

### Security

- приватные ключи, private extended keys, mnemonic, seed и signing workflows определены как запрещённые входные домены;
- core analyzers закреплены как offline-first и network-independent;
- новые модули обязаны иметь input limits, negative tests и явные diagnostics.

## [0.3.0] — 2026-07-22

### Added

- рабочая вкладка Descriptor Explorer;
- импорт `wsh(sortedmulti(...))` descriptor;
- Bitcoin Core descriptor checksum;
- проверка существующего checksum;
- автоматическое добавление или исправление checksum;
- разбор threshold, количества ключей, fingerprints, origin paths и branches;
- определение mainnet, testnet, mixed и unknown network;
- Health Score;
- обнаружение дубликатов extended public key;
- предупреждение о совпадающих fingerprints;
- предупреждения для `1-of-N` и `N-of-N`;
- компактный и форматированный вывод descriptor;
- Demo Mode с искусственной конфигурацией `2-of-3`;
- проверка BIP-48 paths, branches и SLIP-132 compatibility;
- прямая передача descriptor из Multisig Builder в Descriptor Explorer.

### Changed

- декоративная вкладка Descriptor Explorer заменена рабочим инструментом;
- состояние Builder и Explorer сохраняется при переключении вкладок.

## [0.2.0] — 2026-07-22

### Added

- Base58Check-разбор extended public keys;
- checksum и version-byte validation;
- `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- отклонение private extended keys;
- BIP-32 field inspection;
- fingerprint и key-origin validation;
- multisig presets;
- receive/change descriptors;
- GitHub Actions.

### Security

- private extended keys отклоняются до генерации descriptor;
- descriptor блокируется при duplicate extended public keys;
- совпадающие fingerprints показываются как предупреждение.

## [0.1.0] — 2026-07-22

### Added

- отдельный Next.js-репозиторий;
- Multisig Builder;
- Bitcoin Mainnet и Testnet;
- N-of-M policies для 2–5 signer-ов;
- ввод public fingerprint, origin path и extended public key;
- генерация `wsh(sortedmulti(...))`;
- базовые проверки и копирование descriptor.
