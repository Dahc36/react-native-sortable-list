export function findIndex(rangeArray, value) {
  if (value > rangeArray[rangeArray.length - 1]) {
    return rangeArray.length - 1;
  }
  let leftPointer = 0;
  let rightPointer = rangeArray.length - 1;
  while (leftPointer <= rightPointer) {
    let middlePoint = Math.floor((leftPointer + rightPointer) / 2);
    if (rangeArray[middlePoint] < value) {
      if (middlePoint === rangeArray.length || rangeArray[middlePoint + 1] > value) {
        return middlePoint + 1;
      }
      leftPointer = middlePoint + 1;
    } else if (rangeArray[middlePoint] > value) {
      if (middlePoint === 0 || rangeArray[middlePoint - 1] < value) {
        return middlePoint;
      }
      rightPointer = middlePoint - 1;
    } else {
      return middlePoint;
    }
  }
  throw new Error('Whoops, I messed up implementing this');
}
