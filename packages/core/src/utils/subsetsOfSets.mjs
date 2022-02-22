// note that compareFn must be injective
export function subsetsOfSets(left, right, compareFn) {
  const leftOnlyMap = new Map();
  const [numLeft, numRight] = [left.length, right.length];
  const rightOnly = [];
  const intersection = [];
  const union = [];

  for (let i = 0; i < numLeft; i += 1) {
    leftOnlyMap.set(compareFn(left[i]), left[i]);
    union.push(left[i]);
  }

  for (let i = 0; i < numRight; i += 1) {
    const item = right[i];
    const rightComp = compareFn(item);
    if (leftOnlyMap.has(rightComp)) {
      leftOnlyMap.delete(rightComp);
      intersection.push(item);
    } else {
      rightOnly.push(item);
      union.push(item);
    }
  }

  return {
    left,
    right,
    leftOnly: Array.from(leftOnlyMap.values()),
    rightOnly,
    intersection,
    union,
  };
}
