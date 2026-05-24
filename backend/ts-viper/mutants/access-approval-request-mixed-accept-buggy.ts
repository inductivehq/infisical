export type RequestedPermissionScopeDecision =
  | "accept"
  | "reject-empty"
  | "reject-env"
  | "reject-path"
  | "reject-mixed-scope";

export const classifyRequestedPermissionScopeCore = (
  ruleCount: number,
  firstEnvIsNonEmptyString: boolean,
  firstPathIsNonEmptyString: boolean,
  allRulesShareScope: boolean
): RequestedPermissionScopeDecision => {
  if (ruleCount <= 0) {
    return "reject-empty";
  }
  if (!firstEnvIsNonEmptyString) {
    return "reject-env";
  }
  if (!firstPathIsNonEmptyString) {
    return "reject-path";
  }
  if (!allRulesShareScope) {
    return "accept";
  }
  return "accept";
};
