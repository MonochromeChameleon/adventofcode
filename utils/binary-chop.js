export function findTrue(ii, func, inc = (m) => m * 2) {
  let mul = 1;
  while (!func(ii * mul)) {
    mul = inc(mul);
  }
  return mul * ii;
}

export function binaryChop(ii, func, high = findTrue(ii, func), low = 0) {
  let highBound = high;
  let lowBound = low;

  while (lowBound !== highBound && lowBound !== highBound - 1) {
    const mid = ~~((lowBound + highBound) / 2);
    if (func(mid)) {
      highBound = mid;
    } else {
      lowBound = mid;
    }
  }
  return highBound;
}
