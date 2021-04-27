import { URL } from 'url';
import * as O from 'fp-ts/Option';
import { getStringWithHeadersRetriesAndDurationLogging } from './fetchers';
import { Logger } from './logger';
import { Doi } from '../types/doi';

type GetXmlFromCrossrefRestApi = (doi: Doi, acceptHeader: string) => Promise<string>;

export const getXmlFromCrossrefRestApi = (
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
  const response = await getStringWithHeadersRetriesAndDurationLogging(logger, 3)(url.toString(), headers);
  if (response.data.length === 0) {
    throw new Error('Empty response from Crossref');
  }
  return response.data;
};
