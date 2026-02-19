import { URL } from 'url';
import axios, { AxiosResponse } from 'axios';
import { LogLevel, Logger } from '../logger';
import * as DE from '../types/data-error';

const notFoundResponseStatuses = [404, 410];

const isANotFoundResponse = (
  response: AxiosResponse | undefined,
) => response?.status !== undefined && notFoundResponseStatuses.includes(response?.status);

export const logAndTransformToDataError = (logger: Logger, url: string, notFoundLogLevel: LogLevel = 'warn') => (error: unknown): DE.DataError => {
  let validatedUrl;
  try {
    validatedUrl = new URL(url);
  } catch (_error: unknown) {
    logger('error', 'Received an invalid url.', { url });
    return DE.unavailable;
  }
  if (axios.isAxiosError(error)) {
    const logPayload = { error, responseBody: error.response?.data };
    if (isANotFoundResponse(error.response)) {
      logger(notFoundLogLevel, 'Third party data not found', logPayload);
      return DE.notFound;
    }
    logger('error', `Request to ${validatedUrl.hostname} failed`, logPayload);
    return DE.unavailable;
  }
  logger('error', 'Unknown failure while attempting a third party request', { error, url });
  return DE.unavailable;
};
