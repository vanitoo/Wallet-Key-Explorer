# TODO — Wallet Key Explorer

## Назначение

Wallet Key Explorer — локальный офлайн-набор инструментов для анализа уже существующих **публичных** Bitcoin-объектов:

- extended public keys;
- wallet descriptors;
- multisig-конфигураций;
- адресов;
- PSBT;
- публичных backup packages.

Проект не принимает seed-фразы, mnemonic passphrase, приватные extended keys и отдельные приватные ключи.

Wallet Explorer, Seed Explorer, Derivation Explorer, генерация адресов из seed и сравнение derivation paths перенесены в roadmap проекта **HD Wallet Explorer**.

---

## Completed

- [x] Отдельный Next.js-репозиторий
- [x] Multisig Builder
- [x] Bitcoin Mainnet / Testnet
- [x] N-of-M для 2–5 подписантов
- [x] `wsh(sortedmulti(...))`
- [x] Receive/change descriptors
- [x] Descriptor checksum
- [x] Demo Mode
- [x] Base58Check-разбор extended public keys
- [x] Проверка checksum и version bytes
- [x] Распознавание `xpub/ypub/zpub/tpub/upub/vpub`
- [x] Блокировка приватных extended keys
- [x] Проверка depth, parent fingerprint, child number, chain code и public key
- [x] Descriptor Explorer
- [x] BIP-48 и branch diagnostics
- [x] Health Score
- [x] Прямая передача descriptor из Builder в Explorer
- [x] GitHub Actions

---

## Priority 1 — укрепление Descriptor Explorer

- [ ] Унифицировать Base58Check-проверку со всеми публичными анализаторами
- [ ] Поддержать `sh(wsh(...))`
- [ ] Поддержать `wpkh(...)`
- [ ] Поддержать `sh(wpkh(...))`
- [ ] Поддержать `tr(...)`
- [ ] Поддержать `multi(...)`
- [ ] Импортировать descriptor обратно в Multisig Builder
- [ ] Распознавать receive/change пары
- [ ] Показывать diff исходного и нормализованного descriptor
- [ ] Добавить визуальную схему policy

## Priority 2 — Extended Key Inspector

- [ ] Отдельная вкладка Key Inspector
- [ ] Network и version bytes
- [ ] Depth
- [ ] Parent fingerprint
- [ ] Child number
- [ ] Chain code
- [ ] Compressed public key
- [ ] Предполагаемый script type
- [ ] SLIP-132 conversion с предупреждением
- [ ] QR import/export только публичных данных

## Priority 3 — Address Explorer

- [ ] Проверка существующего Bitcoin address
- [ ] Mainnet/Testnet/Regtest
- [ ] Base58 / Bech32 / Bech32m
- [ ] P2PKH, P2SH, P2WPKH, P2WSH, P2TR
- [ ] Witness version и witness program
- [ ] ScriptPubKey
- [ ] Проверка checksum
- [ ] Понятное объяснение формата

Address Explorer только анализирует введённый публичный адрес. Генерация адресов из seed относится к HD Wallet Explorer.

## Priority 4 — Multisig Backup Center

- [ ] Название кошелька
- [ ] Network и N-of-M policy
- [ ] Receive/change descriptors
- [ ] Checksums
- [ ] Fingerprints и derivation paths
- [ ] Extended public keys
- [ ] Имена и роли участников
- [ ] JSON/TXT/PDF/QR export
- [ ] Контрольная хеш-сумма файлов
- [ ] Импорт package обратно в приложение
- [ ] Инструкции восстановления публичной конфигурации

Seed backup остаётся задачей Seed Split Tool.

## Priority 5 — экспорт в координаторы

- [ ] Sparrow
- [ ] Specter Desktop
- [ ] Nunchuk
- [ ] BlueWallet Multisig
- [ ] Bitcoin Core descriptors
- [ ] Caravan
- [ ] Не заявлять совместимость без тестов

## Priority 6 — PSBT Inspector

Только чтение и анализ. Без подписи и broadcasting.

- [ ] File/Base64/hex import
- [ ] PSBT v0
- [ ] PSBT v2 после стабилизации v0
- [ ] Inputs и outputs
- [ ] Amounts, fee и fee rate
- [ ] Change detection
- [ ] UTXO data
- [ ] Derivation information
- [ ] Required, existing и missing signatures
- [ ] Unknown/proprietary fields
- [ ] JSON/TXT report

## Security and quality

- [ ] Threat model
- [ ] Security checklist для каждой новой вкладки
- [ ] Tests для parser и validators
- [ ] Accessibility review
- [ ] Dependency review
- [ ] Independent security audit

## Out of scope

- BIP39 mnemonic и passphrase
- entropy и wallet seed
- master/private key derivation
- xprv display
- генерация адресов из seed
- сравнение BIP44/BIP49/BIP84/BIP86 для одного seed
- balance scanning и wallet discovery
- подписание транзакций
- broadcasting

Первые шесть пунктов развиваются в **HD Wallet Explorer**. Recovery и поиск неизвестных путей относятся к **Wallet Recovery Studio**.
