export function computeIssuedTtlCore(
  requestedTTL: number,
  maxTTL: number,
  creationEpoch: number,
  nowSeconds: number,
  ceiling: number
): number {
  let issuedTtl = ceiling;

  if (requestedTTL > 0 && requestedTTL < issuedTtl) {
    issuedTtl = requestedTTL;
  }

  if (maxTTL > 0) {
    const remainingBudget = creationEpoch + maxTTL - nowSeconds;
    if (remainingBudget > 0 && remainingBudget < issuedTtl) {
      issuedTtl = remainingBudget;
    }
  }

  return issuedTtl;
}
