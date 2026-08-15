/**
 * Rounding for reported numbers.
 *
 * Raw division gives values like 0.6888888888888889, which read as noise in
 * JSON output and in a report. Two decimals is enough to act on, and no
 * information is lost: `covered` and `total` are both reported, so an exact
 * ratio is always one division away.
 */

/** Round to two decimal places. Keeps -0 and non-finite values out of output. */
export function round2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}
