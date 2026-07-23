# Roadmap

## Product direction

The project evolves as a collection of focused, read-only analyzers for public Bitcoin cryptographic objects.

It will not expand into seed handling, wallet creation or recovery, balance discovery, signing, finalization or broadcasting.

## v0.4 — cleanup and scope baseline

Status: current.

- remove migrated wallet-oriented functionality and plans;
- establish `src/modules` as the only feature architecture;
- define the public-object-only security boundary;
- rename working UI concepts to Multisig Policy Builder and Descriptor Inspector;
- remove Wallet Explorer and Backup Center from navigation and roadmap;
- document separation from HD Wallet Explorer, Wallet Recovery Studio and Seed Split Tool;
- keep extended-key validation, multisig policies and descriptor inspection as the working baseline.

## v0.5 — parser foundation

- shared Base58Check and version-byte codec;
- stable diagnostic model;
- input-size and complexity limits;
- descriptor checksum fixtures;
- extended-key and descriptor parser tests;
- regression test suite;
- threat model.

## v0.6 — Descriptor Inspector expansion

- `sh(wsh(...))`;
- `wpkh(...)` and `sh(wpkh(...))`;
- `tr(...)`;
- `multi(...)` and `sortedmulti(...)`;
- descriptor pairs and multipath descriptors;
- source/normalized diff;
- policy visualization;
- normalized text/JSON reports.

## v0.7 — Extended Key Inspector

- dedicated inspector UI;
- complete BIP-32 field breakdown;
- network and version bytes;
- SLIP-132 interpretation;
- public-prefix conversion warnings;
- key-origin metadata explanation;
- JSON/TXT reports.

## v0.8 — Address and Script Inspectors

Address Inspector:

- Base58Check, Bech32 and Bech32m;
- P2PKH, P2SH, P2WPKH, P2WSH and P2TR;
- witness program and scriptPubKey;
- network and checksum diagnostics.

Script Inspector:

- hex/script parsing;
- opcode disassembly;
- standard script recognition;
- redeemScript/witnessScript analysis;
- script hashes and comparison tools.

## v0.9 — Transaction and PSBT Inspectors

Transaction Inspector:

- raw transaction parsing;
- vin, vout, sequence and locktime;
- SegWit/Taproot recognition;
- weight and virtual size;
- script and witness diagnostics.

PSBT Inspector, read-only:

- PSBT v0 and v2;
- Base64/hex/file import;
- global/input/output maps;
- UTXO, amount, fee and fee-rate diagnostics;
- derivation and signature metadata;
- unknown/proprietary fields;
- conflict detection;
- JSON/TXT reports.

No signing, finalization or broadcasting.

## v0.10 — Signature, Miniscript and interoperability

- DER ECDSA and Schnorr signature inspection;
- sighash decoding;
- Miniscript parsing and policy visualization;
- Bitcoin Core descriptor fixtures;
- Sparrow public descriptor interchange;
- Specter and Caravan public configuration import;
- generic report schema;
- executable compatibility matrix.

## v1.0 — stable public object toolkit

Release criteria:

- stable module APIs;
- complete security boundary enforcement;
- parser and validator coverage;
- fuzz/property tests for codecs;
- accessibility review;
- dependency review;
- performance limits for large objects;
- independent security review;
- no path for private-key, seed, wallet-runtime, signing or network-dependent balance functionality.

## Separate projects

- **HD Wallet Explorer** — HD derivation, seed-derived structures and wallet exploration.
- **Wallet Recovery Studio** — recovery workflows and unknown-path investigation.
- **Seed Split Tool** — seed backup and split workflows.
