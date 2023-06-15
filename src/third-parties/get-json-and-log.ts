import * as TE from 'fp-ts/TaskEither';
import axios from 'axios';
import { Json } from 'fp-ts/Json';
import { Logger, GetJson } from '../shared-ports';
import * as DE from '../types/data-error';

type Ports = {
  getJson: GetJson,
  logger: Logger,
};

export const logAndTransformToDataError = (logger: Logger, url: string) => (error: unknown): DE.DataError => {
  if (axios.isAxiosError(error)) {
    const logPayload = { error, response: error.response?.data };
    if (error.response?.status === 404) {
      logger('warn', 'Third party data not found', logPayload);
      return DE.notFound;
    }
    logger('error', 'Request to third party failed', logPayload);
    return DE.unavailable;
  }
  logger('error', 'Request to third party failed', { error, url });
  return DE.unavailable;
};

export const getJsonAndLog = (ports: Ports) => (url: string): TE.TaskEither<DE.DataError, Json> => TE.tryCatch(
  async () => ports.getJson(url),
  logAndTransformToDataError(ports.logger, url),
);
