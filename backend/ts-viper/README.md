# Infisical ts-viper MVP

This directory contains fork-local verification artifacts for the machine identity access-token TTL
MVP. The production helper remains in `backend/src/services/identity-access-token`, while generated
spec outputs and evaluation files stay under this directory.

## Target

- Runtime: `backend/src/services/identity-access-token/identity-access-token-ttl.ts`
- Golden spec: `backend/ts-viper/goldens/identity-access-token-ttl.spec.ts`
- Mutant: `backend/ts-viper/mutants/identity-access-token-ttl-buggy.ts`

The trusted boundary is config loading in `identity-access-token-fns.ts`; the verifier target is the
pure TTL cap decision in `computeIssuedTtlCore(...)`.

## Commands

From the `ts-viper` checkout:

```sh
cd /Users/andy/dev/ts-viper/specr
mkdir -p /Users/andy/dev/infisical/backend/ts-viper/generated/run-001
uv run specr generate \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts:computeIssuedTtlCore \
  --model "$SPECR_MODEL" \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/run-001
```

Verify and score a generated sidecar:

```sh
uv run specr score \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts \
  --output /Users/andy/dev/infisical/backend/ts-viper/generated/run-001/identity-access-token-ttl.spec.ts \
  --golden /Users/andy/dev/infisical/backend/ts-viper/goldens/identity-access-token-ttl.spec.ts \
  --mutant /Users/andy/dev/infisical/backend/ts-viper/mutants/identity-access-token-ttl-buggy.ts \
  --eval-dir /Users/andy/dev/infisical/backend/ts-viper/evals \
  --server-url "$VIPER_SERVER_URL"
```

Generated outputs and eval artifacts are ignored by git.

## Current MVP Status

Implemented:

- `computeIssuedTtlCore(...)` is the pure verifier target.
- `computeIssuedTtl(...)` keeps the existing production API and delegates to the pure core after
  reading `MAX_MACHINE_IDENTITY_TOKEN_AGE`.
- The golden spec verifies the good runtime with ViperServer.
- A buggy mutant that ignores `maxTTL` fails verification through `specr score`.

Validation run:

```sh
cd /Users/andy/dev/ts-viper/specr
uv run specr generate \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts:computeIssuedTtlCore \
  --llm-fixture /Users/andy/dev/infisical/backend/ts-viper/generated/run-001/llm-fixture.json \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/run-001

uv run specr score \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts \
  --output /Users/andy/dev/infisical/backend/ts-viper/generated/run-001/identity-access-token-ttl.spec.ts \
  --golden /Users/andy/dev/infisical/backend/ts-viper/goldens/identity-access-token-ttl.spec.ts \
  --eval-dir /Users/andy/dev/infisical/backend/ts-viper/evals \
  --server-url "$VIPER_SERVER_URL"

uv run specr score \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts \
  --output /Users/andy/dev/infisical/backend/ts-viper/generated/run-001/identity-access-token-ttl.spec.ts \
  --golden /Users/andy/dev/infisical/backend/ts-viper/goldens/identity-access-token-ttl.spec.ts \
  --mutant /Users/andy/dev/infisical/backend/ts-viper/mutants/identity-access-token-ttl-buggy.ts \
  --eval-dir /Users/andy/dev/infisical/backend/ts-viper/evals \
  --server-url "$VIPER_SERVER_URL"
```

Results:

- generated spec: `parsable: passed`
- good runtime: `provable: passed`
- mutant score: `provable: passed`; the underlying mutant verification result was `provable: false`
- accuracy: `not_scored`; `specr` does not yet have an Infisical claim-corpus domain

Real model trial:

```sh
cd /Users/andy/dev/ts-viper/specr
env SPECR_MODEL=openai/gpt-5.5 uv run specr generate \
  /Users/andy/dev/infisical/backend/src/services/identity-access-token/identity-access-token-ttl.ts:computeIssuedTtlCore \
  --model openai/gpt-5.5 \
  --output-dir /Users/andy/dev/infisical/backend/ts-viper/generated/gpt-5.5-20260521-1
```

This real `gpt-5.5` generation completed, but the generated sidecar did not parse. It emitted
`requires(!Number.isNaN(ceiling))`, and `Number.isNaN(...)` is outside the current sidecar
expression subset. `specr score` reported `parsable: failed`, so provability was not run.

Next steps:

- Tighten the generation prompt or normalization pass so model outputs cannot include unsupported
  helper calls such as `Number.isNaN(...)`.
- Add a claim-corpus domain in `ts-viper` if semantic recall scoring is needed.
- Evaluate the CASL glob-boundary helper as the next higher-value Infisical target.
