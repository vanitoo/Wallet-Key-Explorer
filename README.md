# Wallet Key Explorer

Локальный офлайн-набор инструментов для анализа **уже существующих публичных криптографических объектов Bitcoin**: extended public keys, wallet descriptors, multisig-конфигураций, адресов и PSBT.

> Текущая версия: **v0.3.0 — Descriptor Explorer**

## Граница проекта

Wallet Key Explorer не является HD-wallet генератором и не работает с секретами кошелька.

В этом проекте остаются:

- Multisig Builder;
- Descriptor Explorer;
- Extended Key Inspector;
- Address Explorer;
- PSBT Inspector;
- анализ derivation paths как части публичных key origin и descriptor;
- экспорт публичных multisig-конфигураций и backup packages.

В отдельном проекте **HD Wallet Explorer** развиваются:

- Wallet Explorer;
- Seed Explorer;
- Derivation Explorer;
- BIP39 mnemonic и passphrase;
- получение wallet seed и master keys;
- генерация адресов из seed;
- сравнение BIP44/BIP49/BIP84/BIP86 derivation paths.

## Возможности

### Multisig Builder

- Bitcoin Mainnet и Testnet;
- P2WSH descriptor формата `wsh(sortedmulti(...))`;
- конфигурации от 2 до 5 подписантов;
- шаблоны `2-of-3`, `3-of-5` и `2-of-2`;
- Demo Mode с искусственной конфигурацией;
- ввод имени, master fingerprint, derivation path и extended public key;
- стандартный путь BIP-48;
- проверки дубликатов ключей и fingerprints;
- receive descriptor `/0/*` и change descriptor `/1/*`;
- передача descriptor напрямую в Descriptor Explorer.

### Descriptor Explorer

- импорт `wsh(sortedmulti(...))`;
- Bitcoin Core descriptor checksum;
- нормализация descriptor;
- разбор threshold, signer keys, fingerprints, origin paths и branches;
- определение сети;
- диагностика BIP-48, receive/change branches и SLIP-132;
- предупреждения о дубликатах и несовместимости;
- Health Score.

### Extended-key validation

- Base58Check-разбор;
- проверка checksum;
- определение сети по version bytes;
- поддержка `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- запрет приватных extended keys;
- проверка depth, parent fingerprint, child number, chain code и compressed public key.

## Запуск локально

Требуется Node.js 20 или новее.

```bash
npm install
npm run check
npm run dev
```

Откройте:

```text
http://localhost:3200
```

## Demo Mode

1. Откройте **Multisig Builder**.
2. Нажмите **Загрузить Demo 2 из 3**.
3. Дождитесь проверки публичных ключей.
4. Передайте receive или change descriptor в Descriptor Explorer.
5. Проверьте checksum, BIP-48 path, branch, key type и Health Score.

Demo-ключи являются публичными тестовыми данными. Не отправляйте средства на адреса, связанные с демонстрационной конфигурацией.

## Continuous Integration

GitHub Actions запускает `npm ci` и `npm run check` при push и pull request в `main`, а также вручную через `workflow_dispatch`.

Workflow: `.github/workflows/ci.yml`.

## Безопасность

Приложение предназначено только для публичных данных.

Никогда не вводите:

- seed-фразу;
- mnemonic passphrase;
- `xprv`, `yprv`, `zprv`, `tprv`, `uprv`, `vprv`;
- отдельные приватные ключи;
- пароли или PIN аппаратных кошельков.

Проверка выполняется локально. Приложение не запрашивает балансы и не передаёт ключи во внешние сервисы.

Receive и change descriptors необходимо сохранять вместе. Health Score является диагностической подсказкой, а не гарантией безопасности.

## Roadmap

Ближайшие этапы:

1. унификация Base58Check-проверки между публичными анализаторами;
2. экспорт публичной multisig-конфигурации в Sparrow;
3. дополнительные типы descriptor;
4. Extended Key Inspector;
5. Address Explorer;
6. PSBT Inspector;
7. Backup Center для публичных конфигураций.

Полный план находится в [`TODO.md`](./TODO.md). История версий — в [`CHANGELOG.md`](./CHANGELOG.md).

## Лицензия

MIT
