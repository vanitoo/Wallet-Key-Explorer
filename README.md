# Wallet Key Explorer

Локальный офлайн-набор инструментов для анализа публичных Bitcoin-ключей, wallet descriptor и multisig-конфигураций.

> Текущая версия: **v0.2.0 — Multisig validation**

## Возможности

### Multisig Builder

- Bitcoin Mainnet и Testnet
- P2WSH descriptor формата `wsh(sortedmulti(...))`
- конфигурации от 2 до 5 подписантов
- готовые шаблоны `2-of-3`, `3-of-5` и `2-of-2`
- ввод имени, master fingerprint, derivation path и extended public key
- автоматическая подстановка стандартного пути BIP-48
- отдельные предупреждения для `1-of-N` и `N-of-N`
- блокировка descriptor при дубликатах extended public key
- предупреждение при совпадающих fingerprint
- отдельный receive descriptor с веткой `/0/*`
- отдельный change descriptor с веткой `/1/*`
- независимое копирование обоих descriptors

### Extended-key validation

- настоящий Base58Check-разбор вместо проверки одной регуляркой
- проверка checksum
- определение сети по version bytes
- поддержка `xpub`, `ypub`, `zpub`, `tpub`, `upub`, `vpub`
- запрет приватных extended keys
- проверка depth, parent fingerprint, child number и chain code
- проверка формата compressed public key
- понятные сообщения об ошибках

### Key origin validation

- fingerprint строго из 8 hex-символов
- derivation path с обозначениями `h` и `'`
- нормализация пути
- проверка диапазона индексов
- запрет wildcard внутри origin path

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

Корректный формат fingerprint не доказывает, что он действительно относится к указанному account xpub. Для такой проверки нужны дополнительные исходные данные и сверка в кошельке-координаторе.

Receive и change descriptors необходимо сохранять вместе. Без change descriptor восстановленный кошелёк может некорректно распознавать сдачу.

## Ограничения v0.2

- descriptor checksum пока не добавлен;
- импорт descriptor пока отсутствует;
- приложение не создаёт ключи и не подписывает транзакции;
- совместимость смешанных SLIP-132 key types пока не проверяется полностью;
- перед использованием с реальными средствами конфигурацию необходимо проверить в Sparrow или другом совместимом координаторе.

## Roadmap

Ближайшие этапы:

1. descriptor checksum;
2. проверка совместимости типов ключей и derivation paths;
3. автоматический Health Check;
4. Descriptor Explorer;
5. экспорт конфигурации в Sparrow;
6. Backup Center;
7. PSBT Inspector;
8. Wallet Explorer.

Полный план находится в [`TODO.md`](./TODO.md). История версий находится в [`CHANGELOG.md`](./CHANGELOG.md).

## Лицензия

MIT
