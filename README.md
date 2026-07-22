# Wallet Key Explorer

Локальный офлайн-набор инструментов для анализа публичных Bitcoin-ключей, wallet descriptor и multisig-конфигураций.

> Текущая версия: **v0.3.0 — Descriptor Explorer**

## Возможности

### Multisig Builder

- Bitcoin Mainnet и Testnet
- P2WSH descriptor формата `wsh(sortedmulti(...))`
- конфигурации от 2 до 5 подписантов
- готовые шаблоны `2-of-3`, `3-of-5` и `2-of-2`
- встроенный Demo Mode с искусственной конфигурацией `2-of-3`
- ввод имени, master fingerprint, derivation path и extended public key
- автоматическая подстановка стандартного пути BIP-48
- отдельные предупреждения для `1-of-N` и `N-of-N`
- блокировка descriptor при дубликатах extended public key
- предупреждение при совпадающих fingerprint
- отдельный receive descriptor с веткой `/0/*`
- отдельный change descriptor с веткой `/1/*`
- независимое копирование обоих descriptors
- прямая передача receive или change descriptor в Descriptor Explorer без буфера обмена

### Descriptor Explorer

- импорт публичного descriptor
- получение descriptor напрямую из Multisig Builder
- поддержка `wsh(sortedmulti(...))`
- проверка Bitcoin Core descriptor checksum
- автоматическое добавление или исправление checksum
- разбор threshold, количества ключей, fingerprints, origin paths и branches
- определение mainnet, testnet, mixed или unknown network
- обнаружение дубликатов extended public key
- предупреждение о совпадающих fingerprints
- проверка согласованности derivation paths
- проверка BIP-48 P2WSH path вида `48'/coin'/account'/2'`
- проверка receive/change branches `/0/*` и `/1/*`
- предупреждение при смешении branches внутри одного descriptor
- диагностика совместимости `xpub/tpub` и SLIP-132 ключей `ypub/zpub/upub/vpub`
- предупреждения для `1-of-N` и `N-of-N`
- Health Score от 0 до 100
- компактный и форматированный вывод
- копирование нормализованного descriptor

### Extended-key validation

- настоящий Base58Check-разбор вместо проверки одной регуляркой
- проверка checksum
- определение сети по version bytes
- поддержка `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`
- запрет приватных extended keys
- проверка depth, parent fingerprint, child number и chain code
- проверка формата compressed public key
- понятные сообщения об ошибках

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

Доступные команды:

```bash
npm run dev       # локальная разработка
npm run typecheck # проверка TypeScript
npm run lint      # ESLint
npm run build     # production-сборка
npm run check     # typecheck + lint + build
```

## Проверка Demo Mode

1. Откройте вкладку **Multisig Builder**.
2. Нажмите **Загрузить Demo 2 из 3**.
3. Дождитесь проверки трёх публичных ключей.
4. Нажмите **Проверить receive в Explorer** или **Проверить change в Explorer**.
5. Проверьте checksum, BIP-48 path, branch, key type и Health Score.
6. Вернитесь в Multisig Builder через верхнюю вкладку — созданная конфигурация останется доступна до перезагрузки страницы.

Demo-ключи являются публичными тестовыми данными. Не отправляйте средства на адреса, полученные из этой конфигурации.

## Continuous Integration

GitHub Actions автоматически запускает `npm ci` и `npm run check`:

- при каждом push в `main`;
- при каждом pull request в `main`;
- вручную через `workflow_dispatch`.

Workflow находится в `.github/workflows/ci.yml`.

## Безопасность

Приложение предназначено для работы только с публичными данными кошелька.

Никогда не вводите:

- seed-фразу;
- `xprv`, `yprv`, `zprv`, `tprv`, `uprv`, `vprv`;
- отдельные приватные ключи;
- пароли или PIN аппаратных кошельков.

Проверка выполняется локально. Приложение не запрашивает балансы и не передаёт ключи во внешние сервисы.

Receive и change descriptors необходимо сохранять вместе. Без change descriptor восстановленный кошелёк может некорректно распознавать сдачу.

Предупреждение о типе extended key не всегда означает, что descriptor невалиден. Некоторые координаторы экспортируют ключи в собственном или преобразованном формате. Перед использованием с реальными средствами сверяйте descriptor, fingerprints и первые адреса в исходном кошельке-координаторе.

## Ограничения v0.3

- Descriptor Explorer пока поддерживает только `wsh(sortedmulti(...))`;
- импорт `sh(wsh(...))`, `wpkh(...)`, `tr(...)` и других типов ещё не реализован;
- приложение не создаёт ключи и не подписывает транзакции;
- Health Score является диагностической подсказкой, а не гарантией безопасности;
- Base58Check-разбор ключей внутри Descriptor Explorer будет унифицирован с Multisig Builder на следующем этапе;
- перед использованием с реальными средствами конфигурацию необходимо проверить в Sparrow или другом совместимом координаторе.

## Roadmap

Ближайшие этапы:

1. унификация полной Base58Check-проверки внутри Descriptor Explorer;
2. экспорт конфигурации в Sparrow;
3. поддержка дополнительных типов descriptor;
4. Wallet Explorer и генерация адресов;
5. PSBT Inspector;
6. Backup Center.

Полный план находится в [`TODO.md`](./TODO.md). История версий находится в [`CHANGELOG.md`](./CHANGELOG.md).

## Лицензия

MIT
