# Infisical ts-viper Checkpoint

This directory contains fork-local verification artifacts for measuring how far automated speccing
can get on representative Infisical TypeScript code. Runtime code remains under `backend/src`;
goldens, claim corpora, mutants, generated specs, and eval artifacts stay here.

Generated outputs and eval artifacts are ignored by git:

- `generated/`
- `evals/`

## Targets

| Area                       | Runtime target                                                                                                           | Why it is useful                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Machine identity token TTL | `computeIssuedTtlCore(...)` in `src/services/identity-access-token/identity-access-token-ttl.ts`                         | Numeric cap selection with requested TTL, deployment ceiling, and remaining maxTTL budget.    |
| CASL glob containment      | `segmentKindContains(...)` in `src/lib/casl/glob-subset-core.ts`                                                         | Permission-boundary logic for literal, star, globstar, and unsupported path segments.         |
| Access approval requests   | `classifyRequestedPermissionScopeCore(...)` in `src/ee/services/access-approval-request/access-approval-request-core.ts` | Normalized decision table for rejecting empty, malformed, or mixed-scope permission requests. |

The extracted CASL and access-approval helpers are exported `const` function values so they exercise
Specr's const function target discovery and sidecar binding path. The access-approval helper keeps
the production behavior that empty environment/path strings are invalid.

## Artifacts

- Goldens: `backend/ts-viper/goldens/*.spec.ts`
- Claim corpora: `backend/ts-viper/claims/*.json`
- Mutants: `backend/ts-viper/mutants/*-buggy.ts`
- Checkpoints: `backend/ts-viper/checkpoints/`

The goldens are intended as north-star specs: every `requires(...)` or `ensures(...)` clause has a
comment explaining the behavior it asserts, and the claims are validated against the golden before
generated-output accuracy is scored.

## Commands

Run from the `ts-viper` checkout:

```sh
cd /Users/andy/dev/ts-viper/specr
mkdir -p /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-2026-05
```

Generate with GPT 5.5:

```sh
uv run specr generate \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts:computeIssuedTtlCore \
  --model openai/gpt-5.5 \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-2026-05

uv run specr generate \
  /Users/andy/dev/infisical/backend/src/lib/casl/glob-subset-core.ts:segmentKindContains \
  --model openai/gpt-5.5 \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-2026-05

uv run specr generate \
  /Users/andy/dev/infisical/backend/src/ee/services/access-approval-request/access-approval-request-core.ts:classifyRequestedPermissionScopeCore \
  --model openai/gpt-5.5 \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-2026-05
```

Score a generated sidecar against claims:

```sh
uv run specr score \
  /Users/andy/dev/infisical/backend/src/lib/casl/glob-subset-core.ts \
  --output /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-2026-05/glob-subset.spec.ts \
  --golden /Users/andy/dev/infisical/backend/ts-viper/goldens/glob-subset.spec.ts \
  --claims /Users/andy/dev/infisical/backend/ts-viper/claims/glob-subset.json \
  --eval-dir /Users/andy/dev/infisical/backend/ts-viper/evals \
  --server-url "$VIPER_SERVER_URL"
```

Add `--mutant backend/ts-viper/mutants/<name>-buggy.ts` to check whether a generated spec rejects a
known bad runtime. Provability runs only when `--server-url` or `VIPER_SERVER_URL` is set; claim
accuracy and generated-spec quality metrics still run without ViperServer.
