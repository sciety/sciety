import { AxiosError } from 'axios';
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

const isAxiosError = (error: unknown): error is AxiosError => typeof error === 'object'
    && error?.hasOwnProperty('isAxiosError') === true;

export default (getJson: GetJson, logger: Logger): GetDisqusPostCount => (
  async (uri) => {
    const disqusApiKey = process.env.DISQUS_API_KEY ?? '';

    logger('debug', 'Fetching Disqus threads list', { uri });
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${disqusApiKey}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      logger('debug', 'Received response from Disqus', { response: disqusData });
      return Maybe.just(disqusData.response[0].posts);
    } catch (error) {
      const payload: { error: unknown, status?: number } = { error };
      if (isAxiosError(error)) {
        payload.status = error.response?.status;
      }
      if (error instanceof Error) {
        payload.error = {
          message: error.message,
          stack: error.stack,
        };
      }
      if (payload.status && payload.status >= 500) {
        logger('warn', 'Disqus API server error', payload);
      } else {
        logger('error', 'Disqus generic error', payload);
      }
      return Maybe.nothing();
    }
  }
);
