import axios from 'axios';
import { Logger } from '../shared-ports';
import * as DE from '../types/data-error';
import { LevelName } from '../infrastructure/logger';

export const logAndTransformToDataError = (logger: Logger, url: string, notFoundLogLevel: LevelName = 'warn') => (error: unknown): DE.DataError => {
  if (axios.isAxiosError(error)) {
    const logPayload = { error, response: error.response?.data };
    if (error.response?.status === 404 || error.response?.status === 410) {
      logger(notFoundLogLevel, 'Third party data not found', logPayload);
      return DE.notFound;
    }
    logger('error', 'Request to third party failed', logPayload);
    return DE.unavailable;
  }
  logger('error', 'Unknown failure while attempting a third party request', { error, url });
  return DE.unavailable;
};
