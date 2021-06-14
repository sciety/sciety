import axios, { AxiosResponse } from 'axios';
import { Logger } from './logger';

export const fetchString = (
  logger: Logger,
) => async (uri: string, headers: Record<string, string> = {}): Promise<AxiosResponse<string>> => {
  const startTime = new Date();
  try {
    return await axios.get<string>(uri.toString(), { headers });
  } finally {
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger('debug', 'Response time', { uri, durationInMs });
  }
};

export const fetchJson = (
  logger: Logger,
) => async <D>(uri: string, headers: Record<string, string> = {}): Promise<AxiosResponse<D>> => {
  const startTime = new Date();
  return axios.get<D>(uri, { headers })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time', { uri, durationInMs });
    });
};
