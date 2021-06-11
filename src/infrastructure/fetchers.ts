import axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { Json } from 'fp-ts/Json';
import { Logger } from './logger';

export const getJsonResponse = async (uri: string): Promise<AxiosResponse<Json>> => (
  axios.get<Json>(uri)
);

type Gswhradl = (l: Logger, r: number) => (uri: string, h: Record<string, string>) => Promise<AxiosResponse<string>>;

export const getStringWithHeadersRetriesAndDurationLogging: Gswhradl = (logger, retryLimit) => async (uri, headers) => {
  const client = axios.create();
  axiosRetry(client, { retries: retryLimit });
  const startTime = new Date();
  try {
    return await client.get<string>(uri.toString(), { headers });
  } finally {
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger('debug', 'Response time to fetch article from Crossref', { uri, durationInMs });
  }
};

type Gjwhadl = (l: Logger) => (uri: string, h: Record<string, string>) => Promise<AxiosResponse<Json>>;

export const getJsonWithHeadersAndDurationLogging: Gjwhadl = (logger) => async (uri, headers) => {
  const startTime = new Date();
  return axios.get<Json>(uri, { headers })
    .finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time to fetch users from Twitter', { uri, durationInMs });
    });
};
