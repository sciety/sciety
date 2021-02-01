import { URL } from 'url';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Logger } from './logger';
import { Doi } from '../types/doi';

type GetXmlFromCrossrefRestApi = (doi: Doi, acceptHeader: string) => Promise<string>;

export const createGetXmlFromCrossrefRestApi = (
  logger: Logger,
): GetXmlFromCrossrefRestApi => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  return async (doi, acceptHeader) => {
    const url = new URL(`https://api.crossref.org/works/${doi.value}/transform`);
    logger('debug', 'Fetching Crossref article', { url });

    const headers: Record<string, string> = {
      Accept: acceptHeader,
      'User-Agent': 'Sciety (https://sciety.org; mailto:team@sciety.org)',
    };
    if (process.env.CROSSREF_API_BEARER_TOKEN) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
    }
    const startTime = new Date();
    try {
      const response = await client.get<string>(url.toString(), { headers });
      if (response.data.length === 0) {
        throw new Error('Empty response from Crossref');
      }
      return response.data;
    } finally {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time to fetch article from Crossref', { url, durationInMs });
    }
  };
};
