import { URL } from 'url';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Logger } from './logger';
import Doi from '../types/doi';

type GetXmlFromCrossrefRestApi = (doi: Doi, acceptHeader: string) => Promise<string>;

export default (
  userAgent: string,
  logger: Logger,
): GetXmlFromCrossrefRestApi => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  return async (doi, acceptHeader) => {
    const url = new URL(`https://api.crossref.org/works/${doi.value}/transform`);
    logger('debug', 'Fetching Crossref article', { url });

    const headers: Record<string, string> = {
      Accept: acceptHeader,
      'User-Agent': userAgent,
    };
    if (process.env.CROSSREF_API_BEARER_TOKEN) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
    }
    const startTime = new Date();
    try {
      const response = await client.get<string>(url.toString(), { headers });
      return response.data;
    } finally {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time to fetch article from Crossref', { url, durationInMs });
    }
  };
};
