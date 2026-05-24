import { contract, ensures, implies, requires, result } from "@ts-viper-compiler/spec";
import type { RequestedPermissionScopeDecision } from "../../../../src/ee/services/access-approval-request/access-approval-request-core.js";
import { classifyRequestedPermissionScopeCore } from "../../../../src/ee/services/access-approval-request/access-approval-request-core.js";

contract(
  classifyRequestedPermissionScopeCore,
  ({ ruleCount, firstEnvIsNonEmptyString, firstPathIsNonEmptyString, allRulesShareScope }: { ruleCount: number; firstEnvIsNonEmptyString: boolean; firstPathIsNonEmptyString: boolean; allRulesShareScope: boolean }) => [
    requires(Number.isInteger(ruleCount), "rule count is integral"),
    requires(ruleCount >= 0, "rule count is non-negative"),
    ensures(implies(ruleCount <= 0, result<RequestedPermissionScopeDecision>() === "reject-empty"), "empty rule sets are rejected"),
    ensures(implies(ruleCount > 0 && !firstEnvIsNonEmptyString, result<RequestedPermissionScopeDecision>() === "reject-env"), "missing environment is rejected"),
    ensures(implies(ruleCount > 0 && firstEnvIsNonEmptyString && !firstPathIsNonEmptyString, result<RequestedPermissionScopeDecision>() === "reject-path"), "missing path is rejected"),
    ensures(implies(ruleCount > 0 && firstEnvIsNonEmptyString && firstPathIsNonEmptyString && !allRulesShareScope, result<RequestedPermissionScopeDecision>() === "reject-mixed-scope"), "mixed scopes are rejected"),
    ensures(implies(ruleCount > 0 && firstEnvIsNonEmptyString && firstPathIsNonEmptyString && allRulesShareScope, result<RequestedPermissionScopeDecision>() === "accept"), "complete shared scope is accepted"),
  ],
);
