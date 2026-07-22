# Changelog

Все заметные изменения Wallet Key Explorer фиксируются в этом файле.

Формат основан на Keep a Changelog, версии проекта следуют Semantic Versioning.

## [Unreleased]

### Changed

- Уточнено назначение проекта: анализ только существующих публичных криптографических объектов Bitcoin.
- Удалена неактивная вкладка Wallet Explorer.
- Wallet Explorer, Seed Explorer, Derivation Explorer, работа с BIP39 seed и генерация адресов перенесены в roadmap HD Wallet Explorer.
- Roadmap сосредоточен на Multisig Builder, Descriptor Explorer, Extended Key Inspector, Address Explorer, PSBT Inspector и публичном Backup Center.

### Added

- проверка совместимости key type с P2WSH multisig;
- предупреждения для `ypub`, `zpub`, `upub` и `vpub` внутри `wsh(sortedmulti(...))`;
- проверка BIP-48 P2WSH derivation path;
- обнаружение разных account derivation paths у подписантов;
- проверка branches `/0/*` и `/1/*`;
- обнаружение смешанных receive/change branches;
- отображение key type и статуса совместимости для каждого signer;
- расширенный Health Score с учётом path, branch и SLIP-132 рисков;
- прямая передача receive/change descriptor из Multisig Builder в Descriptor Explorer;
- сохранение переданного descriptor при переключении между вкладками.

### Planned

- полная унификация Base58Check-проверки;
- экспорт публичной multisig-конфигурации в Sparrow;
- дополнительные типы descriptor;
- Extended Key Inspector;
- Address Explorer;
- PSBT Inspector.

## [0.3.0] — 2026-07-22

### Added

- рабочая вкладка Descriptor Explorer;
- импорт `wsh(sortedmulti(...))` descriptor;
- Bitcoin Core descriptor checksum;
- проверка существующего checksum;
- автоматическое добавление или исправление checksum;
- разбор threshold, количества ключей, fingerprints, origin paths и branches;
- определение mainnet, testnet, mixed и unknown network;
- Health Score от 0 до 100;
- обнаружение дубликатов extended public key;
- предупреждение о совпадающих fingerprints;
- предупреждения для `1-of-N` и `N-of-N`;
- компактный и форматированный вывод descriptor;
- Demo Mode с искусственной конфигурацией `2-of-3`.

### Changed

- версия проекта повышена до 0.3.0;
- декоративная вкладка Descriptor Explorer заменена рабочим инструментом;
- README обновлён под v0.3.

## [0.2.0] — 2026-07-22

### Added

- полноценный Base58Check-разбор extended public keys;
- проверка checksum;
- определение сети по version bytes;
- распознавание `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- блокировка приватных extended keys;
- проверка BIP-32 полей;
- проверка fingerprint и key origin path;
- multisig templates;
- receive/change descriptors;
- GitHub Actions.

### Security

- приватные extended keys отклоняются до генерации descriptor;
- descriptor блокируется при дубликатах extended public key;
- совпадающие fingerprint показываются как предупреждение.

## [0.1.0] — 2026-07-22

### Added

- отдельный репозиторий Wallet Key Explorer;
- Next.js-приложение;
- Multisig Builder;
- Bitcoin Mainnet и Testnet;
- схемы N-of-M для 2–5 подписантов;
- ввод имени подписанта, fingerprint, derivation path и extended public key;
- генерация `wsh(sortedmulti(...))`;
- базовые проверки и копирование descriptor.
