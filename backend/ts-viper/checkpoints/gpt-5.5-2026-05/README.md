# GPT 5.5 Specr Checkpoint - May 2026

This checkpoint is set up to measure whether GPT 5.5 can generate useful ts-viper sidecar specs for
representative Infisical TypeScript targets without reading goldens, claim corpora, mutants, or eval
metadata.

## Scope

The checkpoint covers three production-used pure core targets:

- `computeIssuedTtlCore(...)`
  - Source: `backend/src/services/identity-access-token/identity-access-token-ttl.ts`
  - Behavior: numeric min-cap decision for requested TTL, deployment ceiling, and remaining maxTTL.
- `segmentKindContains(...)`
  - Source: `backend/src/lib/casl/glob-subset-core.ts`
  - Behavior: segment-level permission-boundary containment for literal, star, globstar, and
    unsupported segment kinds.
- `classifyRequestedPermissionScopeCore(...)`
  - Source: `backend/src/ee/services/access-approval-request/access-approval-request-core.ts`
  - Behavior: access-approval permission-scope validation, including empty request, missing
    non-empty environment/path, mixed scope, and accepted same-scope requests.

The glob and access targets are exported `const` function values, so this checkpoint exercises
Specr's const function target discovery and sidecar binding support. The helpers use single-return
control flow because current Viper lowering models `return` as an assignment rather than a control
flow exit. The string-valued target aliases are verifier-facing `string` aliases; the claims and
comments preserve the intended observable string values.

## Evaluation Artifacts

- Goldens: `backend/ts-viper/goldens/*.spec.ts`
- Claims: `backend/ts-viper/claims/*.json`
- Mutants: `backend/ts-viper/mutants/*-buggy.ts`

Each golden clause includes a comment explaining the behavior being asserted. The claim corpora are
validated against the corresponding golden before generated-output accuracy is scored.

## Current Validation

Run from `/Users/andy/dev/ts-viper/specr`.

Good runtime goldens:

| Target                                 | Parsable | Provable | Claim recall |
| -------------------------------------- | -------- | -------- | ------------ |
| `computeIssuedTtlCore`                 | passed   | passed   | 1.0          |
| `segmentKindContains`                  | passed   | passed   | 1.0          |
| `classifyRequestedPermissionScopeCore` | passed   | passed   | 1.0          |

Mutant checks:

| Target family   | Mutants | Result                          |
| --------------- | ------: | ------------------------------- |
| TTL             |       3 | all rejected by the golden spec |
| Glob subset     |       3 | all rejected by the golden spec |
| Access approval |       3 | all rejected by the golden spec |

`specr score` reports mutant runs as `provable: passed` when the expected verification failure is
observed for the mutant runtime.

## Next Step

Run real GPT 5.5 generations for the three targets, then score each generated sidecar for:

- parsability through the compiler sidecar path
- provability against the good runtime when ViperServer is available
- mutant rejection against the nine known buggy runtimes
- claim recall and weighted recall
- quality signals: useful clause count, precondition count, comment coverage, and artifact flags
