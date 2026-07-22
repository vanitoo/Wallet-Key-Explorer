# TODO — Wallet Key Explorer

## Product boundary

Wallet Key Explorer is an offline toolkit for inspecting existing **public Bitcoin cryptographic objects**.

Allowed domains:

- extended public keys;
- output descriptors;
- multisig policies;
- Bitcoin addresses;
- scripts and witness programs;
- PSBT;
- public metadata and interoperability formats.

Forbidden domains:

- mnemonic, entropy and seed;
- private keys and private extended keys;
- wallet creation, storage or recovery;
- derivation-path brute force;
- balance scanning and wallet discovery;
- signing and broadcasting.

---

## Completed

- [x] Next.js application shell
- [x] module-based `src/modules` architecture
- [x] removal of legacy `src/features` implementation
- [x] Multisig Builder
- [x] P2WSH `wsh(sortedmulti(...))`
- [x] Mainnet/Testnet policies from 2 to 5 signers
- [x] receive/change descriptors
- [x] Demo Mode using public test data
- [x] Base58Check extended-key validation
- [x] public/private extended-key type detection
- [x] BIP-32 field inspection
- [x] Descriptor Explorer
- [x] Bitcoin Core descriptor checksum
- [x] BIP-48, branch and SLIP-132 diagnostics
- [x] Health Score
- [x] direct Builder → Explorer handoff
- [x] CI: typecheck, lint and build
- [x] explicit public-object-only scope

---

## P0 — foundation and tests

- [ ] Move reusable Base58Check/version-byte code into a shared public-object codec
- [ ] Add parser fixtures from Bitcoin Core-compatible descriptors
- [ ] Add unit tests for descriptor checksum
- [ ] Add unit tests for malformed extended keys
- [ ] Add input size limits before parsing
- [ ] Add structured diagnostic codes in addition to human-readable messages
- [ ] Add threat model and security checklist
- [ ] Add architecture dependency checks to prevent feature-to-feature imports

## P1 — Descriptor Inspector

- [ ] Support `sh(wsh(...))`
- [ ] Support `wpkh(...)`
- [ ] Support `sh(wpkh(...))`
- [ ] Support `tr(...)`
- [ ] Support `multi(...)` and `sortedmulti(...)`
- [ ] Recognize descriptor pairs and multipath descriptors
- [ ] Show source-versus-normalized diff
- [ ] Display script policy tree
- [ ] Export normalized descriptor as text/JSON
- [ ] Import a compatible multisig descriptor into Multisig Builder

## P2 — Extended Key Inspector

- [ ] Dedicated Extended Key Inspector tab
- [ ] Decode version bytes and network
- [ ] Display depth, parent fingerprint and child number
- [ ] Display chain code and compressed public key
- [ ] Explain key origin metadata separately from the key payload
- [ ] Detect likely SLIP-132 intent
- [ ] Convert public prefixes with explicit compatibility warnings
- [ ] Export analysis as JSON/TXT
- [ ] Public-data-only QR import/export

## P3 — Address Inspector

- [ ] Mainnet/Testnet/Regtest address parsing
- [ ] Base58Check, Bech32 and Bech32m
- [ ] P2PKH, P2SH, P2WPKH, P2WSH and P2TR
- [ ] checksum validation
- [ ] witness version and witness program
- [ ] derive scriptPubKey from the supplied address
- [ ] detect non-standard or unsupported encodings
- [ ] explain the decoded public structure

Address Inspector only analyzes an address supplied by the user. It does not derive addresses from keys or seed and does not query balances.

## P4 — Script Inspector

- [ ] Hex/script import
- [ ] opcode disassembly
- [ ] script type recognition
- [ ] push-data decoding
- [ ] witness program inspection
- [ ] redeemScript/witnessScript analysis
- [ ] standardness warnings
- [ ] script hash calculation
- [ ] scriptPubKey comparison tools

## P5 — PSBT Inspector

Read-only analysis. No signing, finalization or broadcasting.

- [ ] File/Base64/hex import
- [ ] PSBT v0
- [ ] PSBT v2
- [ ] global/input/output maps
- [ ] transaction inputs and outputs
- [ ] UTXO information
- [ ] amounts, fee and fee rate
- [ ] BIP-32 derivation metadata
- [ ] required, present and missing signatures
- [ ] unknown and proprietary fields
- [ ] duplicate/conflicting field detection
- [ ] JSON/TXT diagnostic report

## P6 — interoperability formats

- [ ] Bitcoin Core descriptor text
- [ ] Sparrow public descriptor import/export
- [ ] Specter public configuration import
- [ ] Caravan public configuration import
- [ ] generic JSON report schema
- [ ] compatibility fixtures and regression tests
- [ ] never claim compatibility without executable fixtures

## Quality gates

- [ ] parser and validator coverage targets
- [ ] fuzz/property tests for codecs
- [ ] accessibility review
- [ ] dependency and supply-chain review
- [ ] performance limits for large PSBT/script inputs
- [ ] independent security review before 1.0

## Permanently out of scope

- BIP-39 mnemonic/passphrase
- entropy and seed
- master/private key derivation
- xprv and private-key handling
- wallet/account creation
- wallet recovery
- derivation-path scanning
- address generation from secrets
- balance and transaction-history lookup
- signing, finalization and broadcasting
- custody, persistence or backup of wallet secrets
