import { LRUCache } from 'lru-cache';

// Create a cache to store in-flight requests
const inflightRequests = new LRUCache({
  // Maximum size of cache
  maxSize: 100,
  // How to calculate size of values
  sizeCalculation: () => 1,
  // Maximum age in ms
  ttl: 30000,
});

/**
 * A utility to deduplicate in-flight requests
 * This replaces the deprecated 'inflight' package with a more modern approach
 * using lru-cache
 * 
 * @param {string} key - A unique key for the request
 * @param {Function} fn - The async function to execute
 * @returns {Promise<any>} - The result of the function
 */
export async function dedupRequest(key, fn) {
  // If we already have this request in flight, return the existing promise
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key);
  }
  
  // Create a new promise for this request
  const promise = (async () => {
    try {
      const result = await fn();
      // Remove from cache when done
      inflightRequests.delete(key);
      return result;
    } catch (error) {
      // Remove from cache on error
      inflightRequests.delete(key);
      throw error;
    }
  })();
  
  // Store the promise in the cache
  inflightRequests.set(key, promise);
  
  return promise;
}

export default dedupRequest; 