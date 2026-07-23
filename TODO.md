# TODO — Public Bitcoin Object Analysis

## Product boundary

Allowed:

- extended public keys;
- descriptors;
- multisig policies;
- addresses;
- scripts and witness programs;
- raw transactions;
- PSBT;
- public signatures and Miniscript;
- public interoperability formats.

Permanently forbidden:

- mnemonic, entropy, seed and passphrase;
- private keys and private extended keys;
- wallet creation, storage or recovery;
- derivation-path brute force and wallet discovery;
- balance scanning;
- signing, finalization and broadcasting;
- custody or persistence of secrets.

## Completed cleanup

- [x] Remove Wallet Explorer from navigation and roadmap
- [x] Remove Backup Center from product direction
- [x] Remove seed/recovery/generation tasks
- [x] Remove legacy `src/features` implementation
- [x] Keep `src/modules` as the only feature architecture
- [x] Rename UI concept to Multisig Policy Builder
- [x] Rename Descriptor Explorer UI concept to Descriptor Inspector
- [x] Define offline public-object-only scope
- [x] Document separate responsibility of HD Wallet Explorer, Wallet Recovery Studio and Seed Split Tool

## P0 — foundation

- [ ] Move Base58Check/version-byte logic into a shared codec
- [ ] Introduce stable diagnostic codes and severities
- [ ] Add input size and complexity limits
- [ ] Add parser fixtures from Bitcoin Core-compatible data
- [ ] Add unit tests for descriptor checksum
- [ ] Add negative tests for malformed extended keys
- [ ] Add threat model and security checklist
- [ ] Add dependency checks preventing cross-module internal imports

## P1 — Descriptor Inspector

- [ ] `sh(wsh(...))`
- [ ] `wpkh(...)` and `sh(wpkh(...))`
- [ ] `tr(...)`
- [ ] `multi(...)` and `sortedmulti(...)`
- [ ] descriptor pairs and multipath descriptors
- [ ] source-versus-normalized diff
- [ ] policy tree visualization
- [ ] JSON/TXT diagnostic export
- [ ] import a compatible descriptor into Multisig Policy Builder

## P2 — Extended Key Inspector

- [ ] Dedicated tab
- [ ] BIP-32 field breakdown
- [ ] version bytes and network
- [ ] SLIP-132 interpretation
- [ ] key-origin metadata explanation
- [ ] public-prefix conversion with warnings
- [ ] JSON/TXT export
- [ ] public-data-only QR import/export

## P3 — Address Inspector

- [ ] Mainnet/Testnet/Regtest
- [ ] Base58Check, Bech32 and Bech32m
- [ ] P2PKH, P2SH, P2WPKH, P2WSH and P2TR
- [ ] witness version and program
- [ ] derive scriptPubKey from a supplied address
- [ ] checksum and encoding diagnostics

Address Inspector analyzes only an address supplied by the user. It never derives addresses from secrets and never queries balances.

## P4 — Script Inspector

- [ ] Hex/script import
- [ ] opcode disassembly
- [ ] script type recognition
- [ ] push-data decoding
- [ ] witness program inspection
- [ ] redeemScript/witnessScript analysis
- [ ] standardness warnings
- [ ] script hash calculation
- [ ] scriptPubKey comparison

## P5 — Transaction Inspector

- [ ] raw transaction hex import
- [ ] version, vin, vout and locktime
- [ ] sequence and RBF diagnostics
- [ ] SegWit/Taproot recognition
- [ ] weight and virtual size
- [ ] script and witness breakdown
- [ ] read-only fee analysis when prevout data is supplied

## P6 — PSBT Inspector

Read-only only. No signing, finalization or broadcasting.

- [ ] Base64/hex/file import
- [ ] PSBT v0 and v2
- [ ] global/input/output maps
- [ ] UTXO, amount, fee and fee-rate diagnostics
- [ ] BIP-32 derivation metadata
- [ ] required, present and missing signatures
- [ ] unknown/proprietary fields
- [ ] duplicate/conflicting field detection
- [ ] JSON/TXT report

## P7 — Signature and Miniscript Inspectors

- [ ] DER ECDSA parsing
- [ ] Schnorr signature parsing
- [ ] sighash decoding
- [ ] canonical encoding diagnostics
- [ ] Miniscript parse and type-check
- [ ] policy-to-Miniscript visualization

## P8 — interoperability

- [ ] Bitcoin Core descriptor fixtures
- [ ] Sparrow public descriptor interchange
- [ ] Specter public configuration import
- [ ] Caravan public configuration import
- [ ] generic report schema
- [ ] executable compatibility matrix

## Quality gates

- [ ] parser and validator coverage targets
- [ ] fuzz/property tests for codecs
- [ ] accessibility review
- [ ] dependency and supply-chain review
- [ ] performance limits for large PSBT/script inputs
- [ ] independent security review before 1.0
