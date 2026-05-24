export type GlobSubsetSegmentKind = "literal" | "star" | "globstar" | "unsupported";

export const segmentKindContains = (
  parentType: GlobSubsetSegmentKind,
  subsetType: GlobSubsetSegmentKind,
  parentValue: string,
  subsetValue: string
): boolean => {
  if (parentType === "unsupported" || subsetType === "unsupported") {
    return false;
  }

  if (parentType === "globstar") {
    return true;
  }

  if (parentType === "star") {
    return subsetType !== "globstar";
  }

  return subsetType === "literal" && (parentValue === subsetValue || parentValue !== "");
};
