import { contract, ensures, implies, requires, result } from "@ts-viper-compiler/spec";
import { computeIssuedTtlCore } from "../../src/services/identity-access-token/identity-access-token-ttl.js";

contract(
  computeIssuedTtlCore,
  ({
    ceiling,
    creationEpoch,
    maxTTL,
    nowSeconds,
    requestedTTL
  }: {
    ceiling: number;
    creationEpoch: number;
    maxTTL: number;
    nowSeconds: number;
    requestedTTL: number;
  }) => [
    requires(0 <= requestedTTL, "Token TTL inputs are normalized to non-negative seconds."),
    requires(0 <= maxTTL, "Token max-TTL inputs are normalized to non-negative seconds."),
    requires(0 < ceiling, "The deployment ceiling is a positive per-issued-token cap."),
    ensures(result<number>() <= ceiling, "Every issued token is capped by the deployment ceiling."),
    ensures(
      implies(requestedTTL > 0, result<number>() <= requestedTTL),
      "A positive requested TTL caps the issued token."
    ),
    ensures(
      implies(maxTTL > 0, result<number>() <= creationEpoch + maxTTL - nowSeconds),
      "A positive maxTTL caps renewal by the remaining lifetime budget."
    ),
    ensures(
      implies(requestedTTL <= 0 && maxTTL <= 0, result<number>() === ceiling),
      "When no token-local cap is active, the ceiling is the issued TTL."
    ),
    ensures(
      implies(requestedTTL > ceiling && maxTTL <= 0, result<number>() === ceiling),
      "The deployment ceiling wins when it is below the requested TTL and no maxTTL budget applies."
    ),
    ensures(
      implies(
        requestedTTL > 0 &&
          requestedTTL <= ceiling &&
          (maxTTL <= 0 || requestedTTL <= creationEpoch + maxTTL - nowSeconds),
        result<number>() === requestedTTL
      ),
      "The requested TTL wins when it is the smallest active cap."
    ),
    ensures(
      implies(
        maxTTL > 0 &&
          creationEpoch + maxTTL - nowSeconds <= ceiling &&
          (requestedTTL <= 0 || creationEpoch + maxTTL - nowSeconds <= requestedTTL),
        result<number>() === creationEpoch + maxTTL - nowSeconds
      ),
      "The remaining maxTTL budget wins when it is the smallest active cap."
    )
  ],
  "Spec asserts that issued machine identity JWT TTL is the minimum active cap across request TTL, renewal budget, and deployment ceiling."
);
