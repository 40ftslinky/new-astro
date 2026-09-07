/** Sample without replacement, leaving the original collection unchanged. */
export function sampleProjects<T>(items: readonly T[], count = 4, random = Math.random): T[] {
  const pool = [...items];
  const size = Math.min(count, pool.length);
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}
