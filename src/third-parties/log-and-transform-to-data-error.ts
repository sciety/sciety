import { URL } from 'url';
import axios, { AxiosResponse } from 'axios';
import { Logger, LoggerLevelName } from '../shared-ports';
import * as DE from '../types/data-error';

const notFoundResponseStatuses = [404, 410];

const isANotFoundResponse = (
  response: AxiosResponse | undefined,
) => response?.status !== undefined && notFoundResponseStatuses.includes(response?.status);

export const logAndTransformToDataError = (logger: Logger, url: URL, notFoundLogLevel: LoggerLevelName = 'warn') => (error: unknown): DE.DataError => {
  if (axios.isAxiosError(error)) {
    const logPayload = { error, responseBody: error.response?.data };
    if (isANotFoundResponse(error.response)) {
      logger(notFoundLogLevel, 'Third party data not found', logPayload);
      return DE.notFound;
    }
    logger('error', `Request to ${url.hostname} failed`, logPayload);
    return DE.unavailable;
  }
  logger('error', 'Unknown failure while attempting a third party request', { error, url });
  return DE.unavailable;
};
