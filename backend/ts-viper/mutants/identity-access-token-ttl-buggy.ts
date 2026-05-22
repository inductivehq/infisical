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

  return issuedTtl;
}
