import { contract, ensures, implies, requires, result } from "@ts-viper-compiler/spec";
import { computeIssuedTtlCore } from "../../../../src/services/identity-access-token/identity-access-token-ttl.js";

contract(
  computeIssuedTtlCore,
  ({ requestedTTL, maxTTL, creationEpoch, nowSeconds, ceiling }: { requestedTTL: number; maxTTL: number; creationEpoch: number; nowSeconds: number; ceiling: number }) => [
    requires(Number.isFinite(requestedTTL), "requested TTL must be finite for TTL comparison"),
    requires(Number.isFinite(maxTTL), "maximum TTL must be finite for budget comparison"),
    requires(Number.isFinite(creationEpoch), "creation epoch must be finite for remaining-budget arithmetic"),
    requires(Number.isFinite(nowSeconds), "current time must be finite for remaining-budget arithmetic"),
    requires(Number.isFinite(ceiling), "ceiling must be finite as the default issued TTL"),
    ensures(result<number>() <= ceiling, "issued TTL is capped by the configured ceiling"),
    ensures(implies(requestedTTL > 0, result<number>() <= requestedTTL), "positive requested TTL caps the issued TTL"),
    ensures(implies(maxTTL > 0, result<number>() <= creationEpoch + maxTTL - nowSeconds), "positive maximum TTL caps issued TTL by remaining lifetime budget"),
    ensures(implies(requestedTTL <= 0 && maxTTL <= 0, result<number>() === ceiling), "without positive request or maximum TTL, the ceiling is issued"),
    ensures(implies(requestedTTL > 0 && requestedTTL <= ceiling && maxTTL <= 0, result<number>() === requestedTTL), "requested TTL is issued when it is the only active cap and does not exceed the ceiling"),
    ensures(implies(maxTTL > 0 && creationEpoch + maxTTL - nowSeconds <= ceiling && (requestedTTL <= 0 || creationEpoch + maxTTL - nowSeconds <= requestedTTL), result<number>() === creationEpoch + maxTTL - nowSeconds), "remaining lifetime budget is issued when it is the tightest active cap"),
    ensures(implies(maxTTL > 0 && ceiling <= creationEpoch + maxTTL - nowSeconds && (requestedTTL <= 0 || ceiling <= requestedTTL), result<number>() === ceiling), "ceiling is issued when no active TTL cap is lower"),
  ],
);
