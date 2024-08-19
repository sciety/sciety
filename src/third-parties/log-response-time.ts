import { AxiosResponse } from 'axios';
import { Logger } from '../logger';

export const logResponseTime = (
  logger: Logger,
  startTime: Date,
  response: AxiosResponse | undefined, url: string,
): void => {
  const durationInMs = new Date().getTime() - startTime.getTime();
  logger('debug', 'Response time', { url, durationInMs, responseStatus: response ? response.status : 'not-available-because-request-failed' });
};
