import axios from 'axios';
import axiosRetry from 'axios-retry';

type GetXml = (uri: string, acceptHeader: string) => Promise<string>;

const getXml: GetXml = async (uri, acceptHeader) => {
  const client = axios.create();
  axiosRetry(client, { retries: 3 });
  const response = await client.get<string>(uri, { headers: { Accept: acceptHeader } });
  return response.data;
};

export default getXml;
