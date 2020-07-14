import { Maybe } from 'true-myth';
import { Logger } from './logger';
import { Json, JsonCompatible } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

type DisqusData = JsonCompatible<{
  response: Array<{
    posts: number;
  }>;
}>;

type GetDisqusPostCount = (uri: string) => Promise<Maybe<number>>;

export default (getJson: GetJson, logger: Logger): GetDisqusPostCount => (
  async (uri) => {
    const disqusApiKey = process.env.DISQUS_API_KEY ?? '';

    logger('debug', 'Fetching Disqus threads list', { uri });
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${disqusApiKey}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      logger('debug', 'Received response from Disqus', { response: disqusData });
      return Maybe.just(disqusData.response[0].posts);
    } catch (error) {
      const payload = { error };
      if (error instanceof Error) {
        payload.error = {
          message: error.message,
          stack: error.stack,
        };
      }
      logger('error', 'Disqus API error', payload);
      return Maybe.nothing();
    }
  }
);
