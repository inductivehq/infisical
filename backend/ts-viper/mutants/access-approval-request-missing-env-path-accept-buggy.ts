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
  if (!firstEnvIsNonEmptyString || !firstPathIsNonEmptyString) {
    return "accept";
  }
  if (!allRulesShareScope) {
    return "reject-mixed-scope";
  }
  return "accept";
};
