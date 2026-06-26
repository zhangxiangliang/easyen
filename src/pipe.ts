/**
 * Left-to-right function composition for same-typed steps.
 *
 *   const f = pipe(a, b, c);  // f(x) === c(b(a(x)))
 *
 * Used to chain the string-cleaning steps into one readable pipeline.
 */
export function pipe<T>(...steps: Array<(value: T) => T>): (value: T) => T {
  return (value: T) => steps.reduce((acc, step) => step(acc), value);
}
