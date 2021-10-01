import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { Logger } from './logger';
import { Doi } from '../types/doi';

type GetXmlFromCrossrefRestApi = (doi: Doi, acceptHeader: string) => Promise<string>;

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
  const getCachedRequest = getCachedAxiosRequest(logger);
  return getCachedRequest<string>(url.toString(), headers);
};
