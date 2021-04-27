import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Json } from 'fp-ts/Json';
import { Logger } from './logger';

export const getJsonResponse = async (uri: string): Promise<{ data: Json }> => (
  axios.get<Json>(uri)
);

type GetJsonWithRetriesAndLogging = (logger: Logger, retryLimit: number) => (uri: string) => Promise<{ data: Json }>;

export const getJsonWithRetriesAndLogging: GetJsonWithRetriesAndLogging = (logger, retryLimit) => async (uri) => {
  const retryingClient = axios.create();
  axiosRetry(retryingClient, {
    retryDelay: (count, error) => {
      logger('debug', 'Retrying HTTP request', { count, error });
      return 0;
    },
    retries: retryLimit,
  });
  return retryingClient.get<Json>(uri);
};
