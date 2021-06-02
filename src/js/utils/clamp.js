export default function clamp(x, y, a) {
  const factor = y - x;
  return x + a * factor;
}
