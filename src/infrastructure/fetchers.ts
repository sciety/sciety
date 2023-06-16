import axios, { AxiosResponse } from 'axios';
import { Logger } from './logger';

export const fetchData = (
  logger: Logger,
  timeout?: number,
) => async <D>(url: string): Promise<AxiosResponse<D>> => {
  const startTime = new Date();
  return axios.get<D>(url, { headers: { 'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)' }, timeout })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time', { url, durationInMs });
    });
};
