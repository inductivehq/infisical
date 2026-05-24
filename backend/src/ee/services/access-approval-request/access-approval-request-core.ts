export type RequestedPermissionScopeDecision = string;

export const classifyRequestedPermissionScopeCore = (
  ruleCount: number,
  firstEnvIsNonEmptyString: boolean,
  firstPathIsNonEmptyString: boolean,
  allRulesShareScope: boolean
): RequestedPermissionScopeDecision => {
  let decision = "accept";

  if (ruleCount <= 0) {
    decision = "reject-empty";
  } else if (!firstEnvIsNonEmptyString) {
    decision = "reject-env";
  } else if (!firstPathIsNonEmptyString) {
    decision = "reject-path";
  } else if (!allRulesShareScope) {
    decision = "reject-mixed-scope";
  }

  return decision;
};
