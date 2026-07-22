# Changelog

Все заметные изменения Wallet Key Explorer фиксируются в этом файле.

Формат основан на Keep a Changelog, версии проекта следуют Semantic Versioning.

## [Unreleased]

### Added

- Demo Mode в Multisig Builder;
- встроенная искусственная конфигурация `2-of-3`;
- три валидных тестовых mainnet xpub;
- кнопка очистки конфигурации;
- заметное предупреждение о запрете использовать demo-ключи с реальными средствами.

### Planned

- проверка совместимости key type и derivation path;
- экспорт конфигурации в Sparrow;
- поддержка дополнительных типов descriptor;
- Wallet Explorer;
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
- отдельное копирование обоих форматов;
- отдельный модуль descriptor engine.

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
- проверка BIP-32 полей: depth, parent fingerprint, child number, chain code и compressed public key;
- понятные причины ошибок в интерфейсе;
- проверка fingerprint как 8 hex-символов;
- поддержка derivation path с `h` и `'`;
- нормализация key origin path;
- запрет wildcard внутри origin path;
- шаблоны multisig `2-of-3`, `3-of-5`, `2-of-2`;
- явное подтверждение риска для `1-of-N`;
- предупреждение для `N-of-N`;
- отображение допустимого числа потерянных ключей;
- отдельные receive и change descriptors;
- GitHub Actions для автоматической проверки сборки.

### Security

- приватные extended keys отклоняются до генерации descriptor;
- descriptor блокируется при дубликатах extended public key;
- совпадающие fingerprint показываются как предупреждение, а не как доказательство одинаковых ключей.

## [0.1.0] — 2026-07-22

### Added

- отдельный репозиторий Wallet Key Explorer;
- Next.js-приложение;
- Multisig Builder;
- Bitcoin Mainnet и Testnet;
- схемы N-of-M для 2–5 подписантов;
- ввод имени подписанта, fingerprint, derivation path и extended public key;
- генерация `wsh(sortedmulti(...))`;
- копирование descriptor;
- базовая проверка префикса сети;
- проверка дубликатов xpub;
- предупреждение о совпадающих fingerprint;
- автоматическая подстановка стандартного BIP-48 пути.