import { contract, ensures, implies, result } from "@ts-viper-compiler/spec";
import { classifyRequestedPermissionScopeCore } from "../../src/ee/services/access-approval-request/access-approval-request-core.js";

contract(
  classifyRequestedPermissionScopeCore,
  ({
    allRulesShareScope,
    firstEnvIsNonEmptyString,
    firstPathIsNonEmptyString,
    ruleCount
  }: {
    allRulesShareScope: boolean;
    firstEnvIsNonEmptyString: boolean;
    firstPathIsNonEmptyString: boolean;
    ruleCount: number;
  }) => [
    ensures(
      implies(ruleCount <= 0, result<string>() === "reject-empty"),
      "An access request without permission rules is rejected."
    ),
    ensures(
      implies(ruleCount > 0 && !firstEnvIsNonEmptyString, result<string>() === "reject-env"),
      "The first permission rule must provide a string environment."
    ),
    ensures(
      implies(
        ruleCount > 0 && firstEnvIsNonEmptyString && !firstPathIsNonEmptyString,
        result<string>() === "reject-path"
      ),
      "The first permission rule must provide a string secret path."
    ),
    ensures(
      implies(
        ruleCount > 0 && firstEnvIsNonEmptyString && firstPathIsNonEmptyString && !allRulesShareScope,
        result<string>() === "reject-mixed-scope"
      ),
      "All requested permission rules must target the same environment and secret path."
    ),
    ensures(
      implies(
        ruleCount > 0 && firstEnvIsNonEmptyString && firstPathIsNonEmptyString && allRulesShareScope,
        result<string>() === "accept"
      ),
      "A non-empty same-scope permission request is accepted for access-type extraction."
    )
  ],
  "Spec asserts the validation decision for normalized access-approval permission scopes."
);
