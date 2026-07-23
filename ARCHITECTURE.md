# Architecture

## System purpose

This repository is a local, read-only analysis environment for public Bitcoin cryptographic objects.

It is not a wallet runtime. It does not own accounts, secrets, balances or transaction-signing state.

## Domain modules

```text
src/
  app/
    page.tsx                    # navigation and cross-tool orchestration
  modules/
    descriptor/
      components/
      lib/
    multisig/
      components/
      lib/
    extended-key/               # planned
    address/                    # planned
    script/                     # planned
    transaction/                # planned
    psbt/                       # planned
    signature/                  # planned
    miniscript/                 # planned
    common/                     # shared codecs after proven reuse
```

Each module exposes:

- parser/decoder functions;
- normalized domain types;
- validators and diagnostics;
- formatters/exporters;
- UI components consuming only the module public API.

## Dependency rules

Allowed:

```text
app -> module components
module components -> same-module lib
module lib -> common
```

Forbidden:

```text
module A components -> module B internals
module A lib -> React or browser UI
common -> domain modules
parser -> network API
```

Cross-tool workflows are coordinated by `src/app`, never through hidden feature-to-feature imports.

## Processing pipeline

All inputs are untrusted serialized public objects.

```text
raw input
  -> size and complexity limits
  -> transport decoding
  -> structural parsing
  -> checksum validation
  -> semantic validation
  -> compatibility diagnostics
  -> normalized object
  -> report/export
```

Parsing and validation remain separate. A structurally valid object may still produce semantic or interoperability warnings.

## Diagnostics

```ts
type Diagnostic = {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
  path?: string;
};
```

UI messages may be localized, but diagnostic codes remain stable for tests and exported reports.

## Security boundary

Rejected at input boundaries:

- mnemonic phrases and BIP-39 passphrases;
- seed and entropy payloads;
- WIF private keys;
- private extended keys;
- signing requests requiring secret material.

No module may:

- persist cryptographic input by default;
- call blockchain explorers or wallet backends;
- derive secrets or addresses from secrets;
- scan balances or transaction history;
- sign, finalize or broadcast transactions;
- claim wallet creation or recovery capability.

Detection of a private object is allowed only to reject it safely and explain the reason.

## Offline-first policy

Core analysis must work without network access. Runtime correctness cannot depend on remote APIs.

## Testing strategy

1. Unit tests for codecs, checksums and parsers.
2. Fixture tests against known Bitcoin Core-compatible objects.
3. Negative tests for malformed, oversized and adversarial inputs.
4. Regression tests for interoperability bugs.
5. Property/fuzz tests for low-level codecs.
6. Build, lint and typecheck in CI.

## Module acceptance criteria

A new analyzer is accepted only when it has:

- a documented public-object scope;
- no secret-handling path;
- normalized typed output;
- explicit error and warning states;
- fixtures and negative tests;
- input size limits;
- README, TODO, ROADMAP and CHANGELOG updates.
