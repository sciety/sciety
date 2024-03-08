// Knows how to
// - Perform http request
// - Cache responses
// - Provide logging of 4xx, 5xx errors and timeouts

export { CachingFetcherOptions, createCachingFetcher } from './caching-fetcher-factory';
export { ResponseBodyCachePredicate } from './cached-getter';
