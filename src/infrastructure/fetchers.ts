import axios, { AxiosResponse } from 'axios';
import { Logger } from './logger';

export const fetchData = (
  logger: Logger,
) => async <D>(uri: string, headers: Record<string, string> = {}): Promise<AxiosResponse<D>> => {
  const startTime = new Date();
  return axios.get<D>(uri, { headers })
    .catch((error) => {
      logger('error', 'fetchData exception', { uri, error });
      throw error;
    })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time', { uri, durationInMs });
    });
};
