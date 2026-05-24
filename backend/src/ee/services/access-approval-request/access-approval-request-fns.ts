import { PackRule, unpackRules } from "@casl/ability/extra";

import { BadRequestError } from "@app/lib/errors";

import { classifyRequestedPermissionScopeCore } from "./access-approval-request-core";
import { TVerifyPermission } from "./access-approval-request-types";

function filterUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

export const verifyRequestedPermissions = ({ permissions }: TVerifyPermission) => {
  const permission = unpackRules(
    permissions as PackRule<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      conditions?: Record<string, any>;
      action: string;
      subject: [string];
    }>[]
  );

  const requestedPermissions: string[] = [];

  const firstPermission = permission?.[0];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const permissionSecretPath = firstPermission?.conditions?.secretPath?.$glob;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const permissionEnv = firstPermission?.conditions?.environment;

  const permissionRules = permission || [];
  const allRulesShareScope = permissionRules.every((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const ruleEnv = p.conditions?.environment;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const rulePath = p.conditions?.secretPath?.$glob;

    return ruleEnv === permissionEnv && rulePath === permissionSecretPath;
  });

  const decision = classifyRequestedPermissionScopeCore(
    permissionRules.length,
    typeof permissionEnv === "string" && permissionEnv.length > 0,
    typeof permissionSecretPath === "string" && permissionSecretPath.length > 0,
    allRulesShareScope
  );

  if (decision === "reject-empty") {
    throw new BadRequestError({ message: "No permission provided" });
  }
  if (decision === "reject-env") {
    throw new BadRequestError({ message: "Permission environment is not a string" });
  }
  if (decision === "reject-path") {
    throw new BadRequestError({ message: "Permission path is not a string" });
  }
  if (decision === "reject-mixed-scope") {
    throw new BadRequestError({
      message: "All permission rules must target the same environment and secret path"
    });
  }

  for (const p of permissionRules) {
    if (p.action[0] === "read") requestedPermissions.push("Read Access");
    if (p.action[0] === "create") requestedPermissions.push("Create Access");
    if (p.action[0] === "delete") requestedPermissions.push("Delete Access");
    if (p.action[0] === "edit") requestedPermissions.push("Edit Access");
  }

  return {
    envSlug: permissionEnv,
    secretPath: permissionSecretPath,
    accessTypes: requestedPermissions.filter(filterUnique)
  };
};
