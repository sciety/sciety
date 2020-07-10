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
    logger('debug', `Fetching Disqus threads list for ${uri}`);
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${process.env.DISQUS_API_KEY}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      logger('debug', `Disqus response: ${JSON.stringify(disqusData)}`);
      return Maybe.just(disqusData.response[0].posts);
    } catch (e) {
      const message = `Disqus API error: ${e.message}`;
      logger('error', message);
      return Maybe.nothing();
    }
  }
);
