export type GlobSubsetSegmentKind = string;

export const segmentKindContains = (
  parentType: GlobSubsetSegmentKind,
  subsetType: GlobSubsetSegmentKind,
  parentValue: string,
  subsetValue: string
): boolean => {
  let contains = false;

  if (parentType === "globstar" && subsetType !== "unsupported") {
    contains = true;
  } else if (parentType === "star" && subsetType !== "globstar" && subsetType !== "unsupported") {
    contains = true;
  } else if (parentType === "literal" && subsetType === "literal" && parentValue === subsetValue) {
    contains = true;
  }

  return contains;
};
