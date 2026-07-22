# Changelog

Все заметные изменения Wallet Key Explorer фиксируются в этом файле.

Формат основан на Keep a Changelog, версии проекта следуют Semantic Versioning.

## [Unreleased]

### Added

- отдельные receive и change descriptors;
- receive branch `/0/*`;
- change branch `/1/*`;
- независимое копирование каждого descriptor;
- предупреждение о необходимости сохранять оба descriptor.

### Planned

- descriptor checksum;
- проверка совместимости key type и derivation path;
- автоматический Health Check конфигурации.

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
- GitHub Actions для автоматической проверки сборки.

### Changed

- версия проекта повышена до 0.2.0;
- README обновлён под текущее состояние проекта;
- проверка сети больше не зависит от текстового префикса ключа.

### Security

- приватные extended keys отклоняются до генерации descriptor;
- descriptor блокируется при дубликатах extended public key;
- совпадающие fingerprint показываются как предупреждение, а не как доказательство одинаковых ключей;
- интерфейс явно сообщает, что fingerprint нельзя криптографически связать с account xpub без дополнительных исходных данных.

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
