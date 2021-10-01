import { URL } from 'url';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import * as O from 'fp-ts/Option';
import { Logger } from './logger';
import { Doi } from '../types/doi';

type GetXmlFromCrossrefRestApi = (doi: Doi, acceptHeader: string) => Promise<string>;

const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000,
});
const api = axios.create({
  adapter: cache.adapter,
});

export const getCachedXmlFromCrossrefRestApi = (
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
): GetXmlFromCrossrefRestApi => async (doi, acceptHeader) => {
  const url = new URL(`https://api.crossref.org/works/${doi.value}/transform`);
  logger('debug', 'Fetching Crossref article', { url });
  const headers: Record<string, string> = {
    Accept: acceptHeader,
    'User-Agent': 'Sciety (https://sciety.org; mailto:team@sciety.org)',
  };
  if (O.isSome(crossrefApiBearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
  }
  const response = await api.get<string>(url.toString(), { headers });
  if (response.request.fromCache) {
    logger('debug', 'Axios XML cache hit', {
      url,
    });
  } else {
    logger('debug', 'Axios XML cache miss', {
      url,
    });
  }
  return response.data;
};
