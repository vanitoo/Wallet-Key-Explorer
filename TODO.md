# TODO — Wallet Key Explorer

Этот файл фиксирует идеи, roadmap и границы проекта после отделения от Seed Split Tool.

## Цель проекта

Wallet Key Explorer — локальный офлайн-набор инструментов для анализа Bitcoin-ключей, путей деривации, wallet descriptor и multisig-конфигураций.

Проект не должен хранить seed-фразы, передавать данные в сеть или подменять полноценный кошелёк-координатор.

---

## Текущее состояние — v0.1

- [x] Отдельный репозиторий
- [x] Next.js-приложение
- [x] Multisig Builder
- [x] Bitcoin Mainnet / Testnet
- [x] Схемы N-of-M для 2–5 подписантов
- [x] Ввод имени подписанта
- [x] Ввод master fingerprint
- [x] Ввод derivation path
- [x] Ввод extended public key
- [x] Генерация `wsh(sortedmulti(...))`
- [x] Копирование descriptor
- [x] Проверка префикса сети
- [x] Проверка дубликатов xpub
- [x] Предупреждение о совпадающих fingerprint
- [x] Автоматическая подстановка стандартного пути для Mainnet/Testnet

---

# Приоритет 1 — довести Multisig Builder до надёжного состояния

## 1. Корректная проверка extended public keys

- [ ] Парсить Base58Check, а не проверять только регулярным выражением
- [ ] Проверять checksum
- [ ] Определять network из version bytes
- [ ] Определять тип ключа: xpub / ypub / zpub / tpub / upub / vpub
- [ ] Проверять depth, child number, chain code и public key
- [ ] Показывать понятную причину ошибки
- [ ] Не принимать приватные extended keys: xprv / yprv / zprv / tprv и аналоги

## 2. Проверка fingerprint и origin

- [ ] Проверять формат fingerprint как 8 hex-символов
- [ ] Выявлять повторяющиеся fingerprint
- [ ] Различать предупреждение и блокирующую ошибку
- [ ] Проверять синтаксис key origin `[fingerprint/path]`
- [ ] Поддержать пути с `h`, `'` и нормализовать представление
- [ ] Проверять hardened/non-hardened элементы
- [ ] Запрещать wildcard внутри origin path

> Важно: без master public key невозможно криптографически доказать, что введённый fingerprint действительно соответствует account xpub. В интерфейсе это должно быть честно указано.

## 3. Политика multisig

- [ ] Запретить бессмысленную конфигурацию 1-of-N без отдельного подтверждения
- [ ] Отдельно предупреждать о N-of-N
- [ ] Добавить шаблоны:
  - [ ] 2-of-3 — личный multisig
  - [ ] 3-of-5 — организация
  - [ ] 2-of-2 — совместный кошелёк
- [ ] Объяснять риски каждой схемы
- [ ] Поддержать более 5 подписантов после проверки UX
- [ ] Добавить настройку типа script policy

## 4. Descriptor generation

- [ ] Добавить descriptor checksum
- [ ] Генерировать receive descriptor с `/0/*`
- [ ] Генерировать change descriptor с `/1/*`
- [ ] Показывать оба descriptor отдельно
- [ ] Поддержать `wsh(sortedmulti(...))`
- [ ] Позже оценить поддержку `wsh(multi(...))`
- [ ] Проверять совместимость всех ключей и путей
- [ ] Не смешивать несовместимые типы extended keys без явной конвертации
- [ ] Показывать нормализованный descriptor

## 5. Health Check

- [ ] Добавить автоматический отчёт конфигурации
- [ ] Все ключи уникальны
- [ ] Fingerprint выглядят корректно
- [ ] Порог допустим
- [ ] Network совпадает
- [ ] Пути согласованы
- [ ] Receive/change descriptor сформированы
- [ ] Descriptor checksum присутствует
- [ ] Backup package ещё не создан
- [ ] Конфигурация ещё не проверена в координаторе
- [ ] Итоговый Security Score
- [ ] Не превращать score в ложную гарантию безопасности

---

# Приоритет 2 — импорт и разбор descriptor

## Descriptor Explorer

- [ ] Отдельная вкладка Descriptor Explorer
- [ ] Вставка output descriptor
- [ ] Разбор wrapper: `wsh`, `sh(wsh)`, `wpkh`, `tr`
- [ ] Разбор `sortedmulti` и `multi`
- [ ] Показ threshold
- [ ] Показ количества ключей
- [ ] Показ каждого signer
- [ ] Показ fingerprint
- [ ] Показ derivation path
- [ ] Показ extended public key
- [ ] Показ wildcard branch
- [ ] Проверка checksum
- [ ] Поиск дубликатов
- [ ] Предупреждение о смешении сетей
- [ ] Предупреждение о потенциально несовместимых путях
- [ ] Визуальная схема N-of-M
- [ ] Импорт descriptor обратно в Multisig Builder

## Descriptor import

- [ ] Кнопка «Импортировать descriptor»
- [ ] Автоматически заполнить Builder
- [ ] Корректно распознавать receive/change пары
- [ ] Не терять порядок ключей для `multi`
- [ ] Нормализовать порядок для `sortedmulti`
- [ ] Показывать diff между исходным и нормализованным descriptor

---

# Приоритет 3 — Wallet Explorer

## Seed / master key exploration

- [ ] Отдельная вкладка Wallet Explorer
- [ ] BIP-39 mnemonic validation
- [ ] Поддержка optional passphrase
- [ ] Показ entropy
- [ ] Показ mnemonic checksum
- [ ] Показ wallet seed
- [ ] Показ master fingerprint
- [ ] Показ xprv только в явно включённом опасном режиме
- [ ] Показ xpub
- [ ] Маскирование чувствительных данных
- [ ] Кнопка полного удаления данных из состояния
- [ ] Автоочистка после тайм-аута

## Derivation Explorer

- [ ] Поддержка BIP-44
- [ ] Поддержка BIP-49
- [ ] Поддержка BIP-84
- [ ] Поддержка BIP-86
- [ ] Пользовательский derivation path
- [ ] Генерация первых адресов
- [ ] Receive/change branches
- [ ] Экспорт списка адресов
- [ ] Сравнение адресов одного seed по разным стандартам
- [ ] Объяснение, почему один seed создаёт разные адреса

## Ограничения безопасности

- [ ] По умолчанию работать без сети
- [ ] Не выполнять автоматический запрос балансов
- [ ] Онлайн-проверки, если появятся, вынести в отдельный явно включаемый режим
- [ ] В интерфейсе постоянно показывать, используется ли сеть
- [ ] Запретить аналитику и внешние скрипты

---

# Приоритет 4 — Key Inspector и Address Explorer

## Key Inspector

- [ ] Разбор xpub/tpub/ypub/zpub/upub/vpub
- [ ] Network
- [ ] Version bytes
- [ ] Depth
- [ ] Parent fingerprint
- [ ] Child number
- [ ] Chain code
- [ ] Compressed public key
- [ ] Предполагаемый script type
- [ ] Конвертация SLIP-132 форматов с предупреждением
- [ ] Проверка checksum
- [ ] QR import/export публичных данных

## Address Explorer

- [ ] Проверка Bitcoin address
- [ ] Mainnet/Testnet/Regtest
- [ ] Base58 / Bech32 / Bech32m
- [ ] Тип адреса: P2PKH, P2SH, P2WPKH, P2WSH, P2TR
- [ ] Witness version
- [ ] Witness program
- [ ] ScriptPubKey
- [ ] Проверка checksum
- [ ] Понятное объяснение формата адреса

---

# Приоритет 5 — Backup Center

Backup Center относится только к публичной конфигурации кошельков и multisig. Seed backup остаётся задачей отдельного Seed Split Tool.

## Multisig Backup Package

- [ ] Создать Backup Center
- [ ] Название кошелька
- [ ] Network
- [ ] Policy N-of-M
- [ ] Receive descriptor
- [ ] Change descriptor
- [ ] Descriptor checksum
- [ ] Fingerprints
- [ ] Derivation paths
- [ ] Extended public keys
- [ ] Имена/роли участников
- [ ] Дата создания
- [ ] Комментарий
- [ ] Версия формата backup

## Форматы экспорта

- [ ] JSON
- [ ] TXT
- [ ] PDF
- [ ] QR
- [ ] ZIP package
- [ ] Отдельный printable recovery sheet
- [ ] Контрольная хеш-сумма файлов
- [ ] Импорт backup package обратно в приложение

## Инструкции восстановления

- [ ] Краткая инструкция
- [ ] Полная инструкция
- [ ] Что необходимо сохранить каждому участнику
- [ ] Что не является секретом
- [ ] Почему descriptor обязателен
- [ ] Что делать при потере одного signer
- [ ] Что делать при компрометации signer

---

# Приоритет 6 — экспорт в координаторы

## Sparrow

- [ ] Исследовать актуальный формат импорта Sparrow
- [ ] Экспорт descriptor.txt
- [ ] Экспорт wallet configuration
- [ ] Документированная ручная проверка
- [ ] Проверка receive/change адресов после импорта

## Другие координаторы

- [ ] Specter Desktop
- [ ] Nunchuk
- [ ] BlueWallet Multisig
- [ ] Bitcoin Core descriptors
- [ ] Caravan
- [ ] Не заявлять совместимость без тестов

---

# Приоритет 7 — PSBT Inspector

На первом этапе только чтение и анализ. Без подписи и broadcasting.

- [ ] Импорт PSBT из файла
- [ ] Импорт Base64
- [ ] Импорт hex
- [ ] PSBT v0
- [ ] Позже PSBT v2
- [ ] Inputs
- [ ] Outputs
- [ ] Amounts
- [ ] Fee
- [ ] Fee rate
- [ ] Change detection
- [ ] UTXO data
- [ ] Derivation information
- [ ] Required signers
- [ ] Existing partial signatures
- [ ] Missing signatures
- [ ] Финальный статус PSBT
- [ ] Предупреждения о неизвестных outputs
- [ ] Никакой подписи приватными ключами в первой версии

---

# Приоритет 8 — Wizard

- [ ] Пошаговый мастер создания multisig
- [ ] Выбор количества участников
- [ ] Выбор threshold
- [ ] Персональный / семейный / организационный сценарий
- [ ] Объяснение схемы простым языком
- [ ] Добавление signer по одному
- [ ] Импорт xpub через буфер
- [ ] Импорт через QR
- [ ] Валидация каждого шага
- [ ] Финальный Health Check
- [ ] Создание Backup Package
- [ ] Чек-лист проверки в Sparrow

## Hardware wallets — позже

- [ ] Ledger
- [ ] Trezor
- [ ] Coldcard
- [ ] BitBox02
- [ ] Keystone
- [ ] Passport
- [ ] Specter DIY
- [ ] Получение fingerprint/xpub через стандартные API
- [ ] Регистрация multisig policy на устройствах
- [ ] Проверка адреса на экране устройства
- [ ] Не начинать этот этап до стабилизации descriptor engine

---

# EVM / Safe

Safe Config Generator не включать в ближайший MVP Bitcoin-инструментов.

Возможный будущий модуль:

- [ ] Выбор EVM network
- [ ] Список owner addresses
- [ ] Threshold
- [ ] Проверка дубликатов
- [ ] Проверка checksum address
- [ ] Экспорт configuration JSON
- [ ] Объяснение, что Safe — smart contract wallet, а не Bitcoin multisig
- [ ] Решить позже: отдельный модуль или отдельный проект

---

# UX и интерфейс

- [ ] Постоянное боковое меню модулей
- [ ] Статусы: готово / beta / planned
- [ ] Tooltips для технических терминов
- [ ] Режим новичка
- [ ] Режим эксперта
- [ ] Хорошая мобильная адаптация
- [ ] Клавиатурная навигация
- [ ] Доступность ARIA
- [ ] Светлая тема
- [ ] Тёмная тема
- [ ] Безопасная кнопка «Очистить всё»
- [ ] Предупреждение перед вставкой приватного ключа
- [ ] Никогда не логировать введённые ключи
- [ ] Не сохранять чувствительные поля в localStorage

---

# Архитектура

- [ ] Модули:
  - [ ] `modules/multisig`
  - [ ] `modules/descriptors`
  - [ ] `modules/wallet`
  - [ ] `modules/keys`
  - [ ] `modules/addresses`
  - [ ] `modules/psbt`
  - [ ] `modules/backup`
- [ ] Общая библиотека Bitcoin primitives
- [ ] Отделить parsing от UI
- [ ] Отделить validation от formatting
- [ ] Типизированные ошибки
- [ ] Никакой криптографической логики внутри React-компонентов
- [ ] Web Worker для тяжёлой деривации
- [ ] Возможность будущего CLI
- [ ] Возможность desktop-сборки после web MVP

---

# Тестирование

- [ ] Unit tests для fingerprint/path normalization
- [ ] Unit tests для extended public key parsing
- [ ] Unit tests для descriptor parser
- [ ] Unit tests для descriptor checksum
- [ ] Unit tests для receive/change generation
- [ ] Test vectors BIP-32
- [ ] Test vectors BIP-39
- [ ] Test vectors BIP-44/49/84/86
- [ ] Test vectors descriptors
- [ ] Проверка известных multisig-конфигураций
- [ ] Negative tests
- [ ] Property-based tests для parser/serializer
- [ ] E2E тест Builder → export → import
- [ ] E2E проверка совместимости с Sparrow
- [ ] Проверка отсутствия сетевых запросов

---

# CI/CD и релизы

- [ ] GitHub Actions: typecheck
- [ ] GitHub Actions: lint
- [ ] GitHub Actions: tests
- [ ] GitHub Actions: build
- [ ] Dependency audit
- [ ] SBOM
- [ ] Проверка bundle на неожиданные сетевые зависимости
- [ ] Versioning
- [ ] CHANGELOG.md
- [ ] ROADMAP.md при росте проекта
- [ ] Release artifacts
- [ ] Статическая офлайн-сборка
- [ ] Проверяемые checksums релизов
- [ ] Подпись релизов

---

# Документация

- [ ] Обновить README после каждого крупного этапа
- [ ] Объяснить модель угроз
- [ ] Объяснить, какие данные секретны
- [ ] Объяснить, какие данные публичны
- [ ] Пошаговая инструкция 2-of-3
- [ ] Пошаговая проверка в Sparrow
- [ ] Инструкция по безопасной офлайн-работе
- [ ] FAQ
- [ ] Glossary:
  - [ ] seed
  - [ ] passphrase
  - [ ] master fingerprint
  - [ ] xpub
  - [ ] derivation path
  - [ ] descriptor
  - [ ] checksum
  - [ ] PSBT
  - [ ] coordinator

---

# Границы проекта

## Входит

- анализ публичных и иерархически детерминированных Bitcoin-ключей;
- создание и проверка descriptor;
- подготовка multisig-конфигураций;
- просмотр адресов и путей деривации;
- анализ PSBT без подписи;
- создание публичного multisig backup package.

## Не входит в ближайшие версии

- хранение средств;
- broadcasting транзакций;
- серверная база пользователей;
- облачное хранение ключей;
- автоматические запросы балансов;
- ввод seed на внешнем сервере;
- замена Sparrow, Specter, Nunchuk или аппаратного кошелька;
- разделение seed — это остаётся в Seed Split Tool.

---

# Предлагаемый порядок версий

## v0.2 — Multisig validation

- [ ] реальный parser extended public keys
- [ ] descriptor checksum
- [ ] receive/change descriptors
- [ ] Health Check

## v0.3 — Descriptor Explorer

- [ ] descriptor parser
- [ ] импорт в Builder
- [ ] визуальная схема

## v0.4 — Backup Center

- [ ] JSON/TXT
- [ ] PDF
- [ ] QR
- [ ] повторный импорт

## v0.5 — Wallet / Derivation Explorer

- [ ] BIP-39
- [ ] BIP-32
- [ ] BIP-44/49/84/86
- [ ] адреса

## v0.6 — Key and Address Inspector

- [ ] xpub inspector
- [ ] address decoder
- [ ] SLIP-132 conversion

## v0.7 — Coordinator exports

- [ ] Sparrow
- [ ] Bitcoin Core
- [ ] другие после тестов

## v0.8 — PSBT Inspector

- [ ] read-only анализ PSBT

## v0.9 — Wizard and hardware integration

- [ ] пошаговый UX
- [ ] первые аппаратные кошельки

## v1.0

- [ ] стабильные форматы
- [ ] полное тестовое покрытие критической логики
- [ ] проверенная совместимость
- [ ] security documentation
- [ ] reproducible offline release
