export interface Lab { L: number; a: number; b: number }

function srgbToLin(c: number) { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }

export function hexToLab(hex: string): Lab {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
  let X = R * 0.4124 + G * 0.3576 + B * 0.1805, Y = R * 0.2126 + G * 0.7152 + B * 0.0722, Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  X /= 0.95047; Y /= 1.0; Z /= 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X), fy = f(Y), fz = f(Z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function deltaE(p: Lab, q: Lab): number {
  return Math.sqrt((p.L - q.L) ** 2 + (p.a - q.a) ** 2 + (p.b - q.b) ** 2);
}
