/**
 * Frame Budget Helper
 *
 * Measures function execution and warns if the budget is exceeded.
 */

export function withFrameBudget<T>(fn: () => T, budgetMs: number): T | null {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  if (elapsed > budgetMs) {
    console.warn(`Frame budget exceeded: ${elapsed.toFixed(2)}ms > ${budgetMs}ms`);
  }
  return result;
}

