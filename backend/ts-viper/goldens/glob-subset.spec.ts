import { contract, ensures, implies, result } from "@ts-viper-compiler/spec";
import type { GlobSubsetSegmentKind } from "../../src/lib/casl/glob-subset-core.js";
import { segmentKindContains } from "../../src/lib/casl/glob-subset-core.js";

contract(
  segmentKindContains,
  ({
    parentType,
    parentValue,
    subsetType,
    subsetValue
  }: {
    parentType: GlobSubsetSegmentKind;
    parentValue: string;
    subsetType: GlobSubsetSegmentKind;
    subsetValue: string;
  }) => [
    ensures(
      implies(parentType === "unsupported" || subsetType === "unsupported", result<boolean>() === false),
      "Unsupported glob segment features fail closed for boundary containment."
    ),
    ensures(
      implies(parentType === "globstar" && subsetType !== "unsupported", result<boolean>() === true),
      "A parent globstar can contain any supported child segment."
    ),
    ensures(
      implies(parentType === "star" && subsetType === "globstar", result<boolean>() === false),
      "A single-segment star cannot contain a child globstar that spans multiple segments."
    ),
    ensures(
      implies(
        parentType === "star" && subsetType !== "globstar" && subsetType !== "unsupported",
        result<boolean>() === true
      ),
      "A single-segment star contains supported literal or star child segments."
    ),
    ensures(
      implies(
        parentType === "literal" && subsetType === "literal",
        result<boolean>() === (parentValue === subsetValue)
      ),
      "Literal parent segments contain only equal literal child segments."
    ),
    ensures(
      implies(parentType === "literal" && subsetType !== "literal", result<boolean>() === false),
      "Literal parent segments do not contain wildcard child segments."
    )
  ],
  "Spec asserts the segment-level permission-boundary containment relation used by CASL glob checks."
);
