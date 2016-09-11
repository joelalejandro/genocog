export function from0upto(max) {
  return Math.floor( Math.random() * (max));
}

export function from0to(max) {
  return Math.floor( Math.random() * (max + 1));
}

export function from1to(max) {
  return 1 + Math.floor( Math.random() * max );
}

export function toRadians(value) {
  return value * 2 * Math.PI;
}

export function gauss2d(Xm, Ym, s) {
  let Xm2 = Math.pow(Xm, 2),
      Ym2 = Math.pow(Ym, 2),
      s2 = Math.pow(s, 2);

  return Math.exp(-((Xm2 + Ym2) / (2 * s2)));
}
