import axios, { AxiosResponse } from 'axios';
import { Json } from 'fp-ts/Json';
import { Logger } from './logger';

type Gswhradl = (l: Logger) => (uri: string, h: Record<string, string>) => Promise<AxiosResponse<string>>;

export const getStringWithHeadersRetriesAndDurationLogging: Gswhradl = (logger) => async (uri, headers = {}) => {
  const startTime = new Date();
  try {
    return await axios.get<string>(uri.toString(), { headers });
  } finally {
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger('debug', 'Response time', { uri, durationInMs });
  }
};

type Gjwhadl = (l: Logger) => (uri: string, h?: Record<string, string>) => Promise<AxiosResponse<Json>>;

export const getJsonWithHeadersAndDurationLogging: Gjwhadl = (logger) => async (uri, headers = {}) => {
  const startTime = new Date();
  return axios.get<Json>(uri, { headers })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time', { uri, durationInMs });
    });
};
