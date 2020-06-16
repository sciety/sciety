import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

interface DisqusData {
  response: Array<{
    posts: number;
  }>;
}

export type FetchDisqusPostCount = (uri: string) => Promise<number>;

export default (getJson: GetJson): FetchDisqusPostCount => {
  const log = createLogger('infrastructure:fetch-disqus-post-count');
  return async (uri) => {
    log(`Fetching Disqus threads list for ${uri}`);
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${process.env.DISQUS_API_KEY}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      log(`Disqus response: ${JSON.stringify(disqusData)}`);

      return disqusData.response[0].posts;
    } catch (e) {
      log(`Disqus API error: ${e.message}`);

      throw e;
    }
  };
};
