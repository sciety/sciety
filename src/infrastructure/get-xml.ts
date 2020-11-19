import axios from 'axios';
import axiosRetry from 'axios-retry';

type GetXml = (uri: string, acceptHeader: string) => Promise<string>;

export default (userAgent: string): GetXml => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  return async (uri, acceptHeader) => {
    const headers: Record<string, string> = { Accept: acceptHeader, 'User-Agent': userAgent };
    if (process.env.CROSSREF_API_BEARER_TOKEN !== undefined) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${process.env.CROSSREF_API_BEARER_TOKEN}`;
    }
    const response = await client.get<string>(uri, { headers });
    return response.data;
  };
};
