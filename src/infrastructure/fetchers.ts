import axios, { AxiosResponse } from 'axios';
import { Logger } from './logger';

export const fetchData = (
  logger: Logger,
) => async <D>(url: string, headers: Record<string, string> = {}): Promise<AxiosResponse<D>> => {
  const startTime = new Date();
  return axios.get<D>(url, { headers })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time', { url, durationInMs });
    });
};
