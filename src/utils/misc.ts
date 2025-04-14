export async function runSerially<T>(promiseFactories: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  for (const factory of promiseFactories) {
    const result = await factory(); // wait for each one before continuing
    results.push(result);
  }
  return results;
}