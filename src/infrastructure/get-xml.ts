import axios from 'axios';
import axiosRetry from 'axios-retry';

type GetXml = (uri: string, acceptHeader: string) => Promise<string>;

export default (): GetXml => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  return async (uri, acceptHeader) => {
    const response = await client.get<string>(uri, { headers: { Accept: acceptHeader } });
    return response.data;
  };
};
