import axios from 'axios';

type GetXml = (uri: string, acceptHeader: string) => Promise<string>;

const getXml: GetXml = async (uri, acceptHeader) => {
  const response = await axios.get<string>(uri, { headers: { Accept: acceptHeader } });
  return response.data;
};

export default getXml;
