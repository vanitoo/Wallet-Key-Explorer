# Architecture

## System purpose

Wallet Key Explorer is a local, read-only analysis environment for public Bitcoin cryptographic objects.

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
    psbt/                       # planned
    common/                     # shared codecs after proven reuse
```

Each domain module should expose:

- parser/decoder functions;
- normalized domain types;
- validators and diagnostics;
- formatters/exporters;
- UI components that consume those public APIs.

## Dependency rules

Allowed:

```text
app -> module components
module components -> same-module lib
module lib -> common
```

Forbidden:

```text
module A components -> module B internal files
module A lib -> React or browser UI
common -> domain modules
parser -> network API
```

Cross-tool workflows are coordinated by `src/app`, not by hidden imports between feature components.

## Data model

All inputs are treated as untrusted serialized public objects.

Recommended processing pipeline:

```text
raw input
  -> size and character limits
  -> transport decoding
  -> structural parsing
  -> checksum validation
  -> semantic validation
  -> compatibility diagnostics
  -> normalized object
  -> report/export
```

Parsing and validation should be separated. A structurally valid object may still produce semantic or interoperability warnings.

## Diagnostics

Diagnostics should eventually use stable codes:

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

- mnemonic phrases;
- seed/entropy payloads;
- WIF private keys;
- private extended keys;
- signing requests that require secret material.

No module may:

- persist user cryptographic input by default;
- call blockchain explorers or wallet backends;
- derive secrets;
- sign, finalize or broadcast transactions;
- claim funds or wallet recovery capability.

## Offline-first policy

Core analysis must work without network access. External references may exist in documentation, but runtime correctness cannot depend on remote APIs.

## Testing strategy

1. Unit tests for codecs, checksum algorithms and parsers.
2. Fixture tests against known Bitcoin Core-compatible objects.
3. Negative tests for malformed and oversized inputs.
4. Regression tests for every interoperability bug.
5. Property/fuzz tests for low-level binary and text codecs.
6. Build, lint and typecheck in CI.

## Module acceptance criteria

A new analyzer is accepted only when it has:

- a documented public-object scope;
- no secret-handling path;
- normalized typed output;
- explicit error and warning states;
- fixtures and negative tests;
- input size limits;
- README/TODO/ROADMAP updates.
