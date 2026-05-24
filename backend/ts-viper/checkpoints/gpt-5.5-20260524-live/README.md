# GPT 5.5 Live Specr Checkpoint - 2026-05-24

This checkpoint contains live `openai/gpt-5.5` generations for the Infisical ts-viper targets.
Each generated sidecar has a paired audit JSON containing the raw prompt messages, raw model
response content, prompt hash, response hash, model name, generated timestamp, and output hash.

## Result Summary

| Target | Good parsable | Good provable | Claim recall | Mutants rejected | Notes |
| --- | --- | --- | --- | ---: | --- |
| `access-approval-request-core.ts` | failed | not_run | None | 0/3 | blocked before verification by unsupported generated helper calls |
| `glob-subset-core.ts` | passed | passed | 1.0 | 3/3 | all checked mutants rejected |
| `identity-access-token-ttl.ts` | failed | not_run | None | 0/3 | blocked before verification by unsupported generated helper calls |

## Files

- `generated/*.spec.ts`: generated sidecar specs.
- `audit/*.generation.json`: raw model exchange and hashes for each generation.
- `evals/*/eval.json`: `specr score` artifacts for good runtimes and mutants.
- `manifest.json`: aggregate provenance and scoring summary.

## Interpretation

This is a real model-usage checkpoint, not a golden-spec checkpoint. It gives a mixed signal:
`segmentKindContains` is a useful successful generation, while the TTL and access-approval outputs
show that the current prompt/normalization still allows unsupported `Number.*` helper calls into
sidecar specs.
