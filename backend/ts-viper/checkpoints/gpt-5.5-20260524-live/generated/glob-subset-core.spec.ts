import { contract, contains, ensures, implies, requires, result } from "@ts-viper-compiler/spec";
import type { GlobSubsetSegmentKind } from "../../../../src/lib/casl/glob-subset-core.js";
import { segmentKindContains } from "../../../../src/lib/casl/glob-subset-core.js";

contract(
  segmentKindContains,
  ({ parentType, subsetType, parentValue, subsetValue }: { parentType: GlobSubsetSegmentKind; subsetType: GlobSubsetSegmentKind; parentValue: string; subsetValue: string }) => [
    requires(parentType === "globstar" || parentType === "star" || parentType === "literal" || parentType === "unsupported", "parent segment kind is recognized"),
    requires(subsetType === "globstar" || subsetType === "star" || subsetType === "literal" || subsetType === "unsupported", "subset segment kind is recognized"),
    ensures(implies(parentType === "globstar" && subsetType !== "unsupported", result<boolean>() === true), "globstar contains any supported subset segment"),
    ensures(implies(parentType === "globstar" && subsetType === "unsupported", result<boolean>() === false), "globstar does not contain unsupported subsets"),
    ensures(implies(parentType === "star" && (subsetType === "star" || subsetType === "literal"), result<boolean>() === true), "star contains single-segment wildcard or literal subsets"),
    ensures(implies(parentType === "star" && (subsetType === "globstar" || subsetType === "unsupported"), result<boolean>() === false), "star cannot contain globstar or unsupported subsets"),
    ensures(implies(parentType === "literal" && subsetType === "literal", result<boolean>() === (parentValue === subsetValue)), "literal containment requires equal segment text"),
    ensures(implies(parentType === "literal" && subsetType !== "literal", result<boolean>() === false), "literal parents contain only literal subsets"),
    ensures(implies(parentType === "unsupported", result<boolean>() === false), "unsupported parents contain no subset segment"),
  ],
);
