# Wallet Key Explorer

Локальный офлайн-набор инструментов для анализа **публичных криптографических объектов Bitcoin**.

Проект принимает уже существующие публичные данные, разбирает их структуру, проверяет кодировки и контрольные суммы, выявляет несовместимости и формирует диагностический отчёт.

> Текущая версия: **v0.4.0 — Public Object Analysis Baseline**

## Назначение проекта

Wallet Key Explorer анализирует:

- extended public keys и связанные BIP-32/SLIP-132 поля;
- output descriptors;
- multisig policies и публичные signer metadata;
- Bitcoin addresses и scriptPubKey;
- Bitcoin Script и witness programs;
- PSBT и связанные публичные форматы обмена;
- checksums, network/version bytes, derivation metadata и interoperability risks.

Проект **не является кошельком**, не создаёт секреты, не ищет средства и не подписывает транзакции.

## Строгая граница

В проекте запрещены и не планируются:

- BIP-39 mnemonic и passphrase;
- entropy, seed и master secret generation;
- импорт, отображение или преобразование приватных ключей;
- xprv/yprv/zprv/tprv/uprv/vprv;
- восстановление кошельков и перебор derivation paths;
- генерация аккаунтов или адресов из seed;
- balance scanning, wallet discovery и blockchain lookup;
- хранение пользовательских кошельков;
- подписание и broadcasting транзакций.

Работа с HD wallets и seed находится в **HD Wallet Explorer**. Recovery-сценарии находятся в **Wallet Recovery Studio**. Резервное копирование seed находится в **Seed Split Tool**.

## Реализовано

### Multisig Builder

- P2WSH `wsh(sortedmulti(...))`;
- Bitcoin Mainnet и Testnet;
- policies от 2 до 5 signer-ов;
- шаблоны `2-of-3`, `3-of-5`, `2-of-2`;
- публичные fingerprints, key origin paths и extended public keys;
- Base58Check и network validation;
- duplicate-key diagnostics;
- receive `/0/*` и change `/1/*` descriptors;
- Demo Mode на искусственных публичных данных;
- передача descriptor напрямую в Descriptor Explorer.

### Descriptor Explorer

- импорт и разбор `wsh(sortedmulti(...))`;
- Bitcoin Core descriptor checksum;
- нормализация и форматирование;
- threshold, signer keys, origins и branches;
- network detection;
- BIP-48, branch и SLIP-132 diagnostics;
- duplicate and compatibility warnings;
- Health Score.

### Extended-key validation engine

- Base58Check decode и checksum;
- version bytes и network;
- `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`;
- depth, parent fingerprint, child number, chain code;
- compressed public key validation;
- отклонение приватных extended keys.

## Архитектура

```text
src/
  app/                         # application shell and tab orchestration
  modules/
    descriptor/
      components/              # descriptor UI
      lib/                     # parser, checksum, formatter, diagnostics
    multisig/
      components/              # multisig policy UI
      lib/                     # extended-key validation and policy helpers
```

Дальнейшие инструменты добавляются только отдельными модулями:

```text
src/modules/
  extended-key/
  address/
  script/
  psbt/
  common/
```

Правила архитектуры:

1. `modules/*/lib` не зависит от React и содержит чистую предметную логику.
2. UI не реализует криптографический parser самостоятельно.
3. Общие кодеки и validators выносятся в `modules/common` только после появления реального повторного использования.
4. Любой импорт считается недоверенным и ограничивается по размеру до разбора.
5. Приватные материалы отклоняются на границе ввода.
6. Инструменты работают offline-first и не обращаются к blockchain API.

Подробности: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Запуск

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

Команды:

```bash
npm run dev       # development server
npm run typecheck # TypeScript
npm run lint      # ESLint
npm run build     # production build
npm run check     # typecheck + lint + build
```

## Безопасность

Вводите только публичные объекты. Никогда не вставляйте mnemonic, seed, private key, private extended key, PIN или пароль аппаратного устройства.

Приложение работает локально, не запрашивает балансы и не отправляет анализируемые данные во внешние сервисы. Диагностические предупреждения и Health Score не являются гарантией корректности конфигурации.

## Документы проекта

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — границы модулей и инженерные правила;
- [`ROADMAP.md`](./ROADMAP.md) — последовательность развития;
- [`TODO.md`](./TODO.md) — конкретные задачи;
- [`CHANGELOG.md`](./CHANGELOG.md) — история изменений.

## Лицензия

MIT
