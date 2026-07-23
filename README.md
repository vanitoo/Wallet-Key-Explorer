# Wallet Key Explorer

Локальный offline-first набор инструментов для анализа **существующих публичных криптографических объектов Bitcoin**.

> Текущее рабочее название сохранено до отдельного этапа переименования. Назначение проекта уже закреплено как Public Bitcoin Object Analysis.

## Назначение

Проект принимает публичный сериализованный объект, разбирает его структуру, проверяет кодировки и контрольные суммы, выявляет ошибки совместимости и формирует понятный диагностический результат.

Поддерживаемые и планируемые домены:

- extended public keys и BIP-32/SLIP-132 metadata;
- output descriptors;
- multisig policies и signer metadata;
- Bitcoin addresses;
- scriptPubKey, redeemScript, witnessScript и witness programs;
- PSBT;
- raw transactions, signatures, Miniscript и связанные публичные форматы.

Проект не является кошельком и не управляет средствами.

## Строгая граница безопасности

В проекте отсутствуют и не планируются:

- mnemonic, BIP-39 passphrase, entropy и seed;
- создание или восстановление HD-кошельков;
- private keys, WIF и private extended keys;
- xprv/yprv/zprv/tprv/uprv/vprv, кроме безопасного распознавания и немедленного отказа;
- derivation-path brute force и wallet discovery;
- генерация адресов из секретов;
- balance scanning и blockchain lookup;
- хранение пользовательских секретов;
- signing, finalization и broadcasting.

HD derivation и работа с seed находятся в **HD Wallet Explorer**. Recovery-сценарии находятся в **Wallet Recovery Studio**. Резервное копирование seed находится в **Seed Split Tool**.

## Реализовано

### Multisig Policy Builder

- P2WSH `wsh(sortedmulti(...))`;
- Mainnet и Testnet;
- политики от 2 до 5 подписантов;
- шаблоны `2-of-3`, `3-of-5`, `2-of-2`;
- public fingerprints, key origins и extended public keys;
- Base58Check и network validation;
- duplicate-key diagnostics;
- receive `/0/*` и change `/1/*` descriptors;
- Demo Mode на искусственных публичных данных;
- прямая передача результата в Descriptor Inspector.

### Descriptor Inspector

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
- depth, parent fingerprint, child number и chain code;
- compressed public key validation;
- отклонение private extended keys.

## Архитектура

```text
src/
  app/                         # navigation and cross-tool orchestration
  modules/
    descriptor/
      components/
      lib/
    multisig/
      components/
      lib/
    extended-key/              # planned
    address/                   # planned
    script/                    # planned
    transaction/               # planned
    psbt/                      # planned
    signature/                 # planned
    miniscript/                # planned
    common/                    # shared codecs after proven reuse
```

Правила:

1. `modules/*/lib` содержит чистую предметную логику и не зависит от React.
2. UI не реализует parser или криптографический codec самостоятельно.
3. Общий код переносится в `common` только после появления реального повторного использования.
4. Любой ввод считается недоверенным и ограничивается по размеру до разбора.
5. Секретные материалы отклоняются на границе ввода.
6. Core-анализ не зависит от сети и внешних blockchain API.
7. Один модуль не импортирует внутренности другого; интеграцию выполняет `src/app`.

Подробнее: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run check
npm run dev
```

Откройте `http://localhost:3200`.

```bash
npm run dev       # development server
npm run typecheck # TypeScript
npm run lint      # ESLint
npm run build     # production build
npm run check     # typecheck + lint + build
```

## Документы

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — границы модулей и инженерные правила;
- [`ROADMAP.md`](./ROADMAP.md) — последовательность развития;
- [`TODO.md`](./TODO.md) — конкретные задачи;
- [`CHANGELOG.md`](./CHANGELOG.md) — история изменений.

## Лицензия

MIT
