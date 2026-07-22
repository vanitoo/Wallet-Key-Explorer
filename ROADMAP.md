# Roadmap

## Product direction

Wallet Key Explorer evolves as a collection of focused, read-only analyzers for public Bitcoin cryptographic objects.

The project will not expand into wallet creation, seed handling, recovery, balance discovery, signing or broadcasting.

## v0.4 — scope and architecture baseline

Status: current.

- remove migrated legacy implementation;
- establish `src/modules` as the only feature architecture;
- define public-object-only product boundary;
- remove Wallet Explorer and Backup Center from project direction;
- document module dependencies and security rules;
- retain Multisig Builder and Descriptor Explorer as the working baseline.

## v0.5 — parser foundation

- shared Base58Check and version-byte codec;
- stable diagnostic model;
- input-size limits;
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
- full BIP-32 field breakdown;
- network and version bytes;
- SLIP-132 interpretation;
- public-prefix conversion warnings;
- key-origin metadata explanation;
- JSON/TXT report export.

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

## v0.9 — PSBT Inspector

Read-only:

- PSBT v0 and v2;
- Base64/hex/file import;
- global/input/output maps;
- UTXO, amount, fee and fee-rate diagnostics;
- derivation and signature metadata;
- unknown/proprietary fields;
- conflict detection;
- JSON/TXT reports.

No signing, finalization or broadcasting.

## v0.10 — interoperability suite

- Bitcoin Core descriptor fixtures;
- Sparrow public descriptor interchange;
- Specter and Caravan public configuration import;
- generic report schema;
- executable compatibility tests;
- documented compatibility matrix.

## v1.0 — stable analysis toolkit

Release criteria:

- stable module APIs;
- complete security boundary enforcement;
- parser and validator test coverage;
- fuzz/property testing for codecs;
- accessibility review;
- dependency review;
- performance limits for large objects;
- independent security review;
- no known path for private-key, seed, signing or network-dependent wallet functionality.

## Separate projects

- **HD Wallet Explorer** — HD derivation, seed-derived structures and wallet exploration.
- **Wallet Recovery Studio** — recovery workflows and unknown-path investigation.
- **Seed Split Tool** — seed backup and split workflows.
