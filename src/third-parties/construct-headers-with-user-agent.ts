export const constructHeadersWithUserAgent = (headers: Record<string, string> = {}): Record<string, string> => ({
  ...headers,
  'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
});
