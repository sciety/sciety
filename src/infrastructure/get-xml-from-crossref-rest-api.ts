import { URL } from 'url';
import axios from 'axios';
import axiosRetry from 'axios-retry';

type GetXmlFromCrossrefRestApi = (url: URL, acceptHeader: string) => Promise<string>;

export default (userAgent: string): GetXmlFromCrossrefRestApi => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  return async (url, acceptHeader) => {
    if (url.hostname !== 'api.crossref.org') {
      throw new Error(`${url.toString()} does not refer to the Crossref REST API`);
    }
    const headers: Record<string, string> = {
      Accept: acceptHeader,
      'User-Agent': userAgent,
    };
    if (process.env.CROSSREF_API_BEARER_TOKEN !== undefined) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
    }
    const response = await client.get<string>(url.toString(), { headers });
    return response.data;
  };
};
