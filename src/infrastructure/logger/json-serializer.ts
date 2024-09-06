import axios, { AxiosError } from 'axios';
import { flow } from 'fp-ts/function';
import { replacer } from './replacer';
import { Serializer } from './serializer';
import { Payload } from './types';

const interpretAxiosStatus = (error: AxiosError<unknown, unknown>) => {
  if (error.response?.status) {
    return error.response.status;
  }
  if (error.code === 'ETIMEDOUT') {
    return 'timeout';
  }
  return 'status-code-not-available';
};

const filterAxiosGarbageInPayload = (payload: Payload) => {
  if (payload.error && axios.isAxiosError(payload.error)) {
    return ({
      ...payload,
      error: {
        url: payload.error.config ? payload.error.config.url : 'url-not-available',
        status: interpretAxiosStatus(payload.error),
        name: payload.error.name,
        message: payload.error.message,
      },
    });
  }

  return payload;
};

export const jsonSerializer = (prettyPrint = false): Serializer => flow(
  (entry) => ({
    ...entry,
    payload: filterAxiosGarbageInPayload(entry.payload),
  }),
  (entry) => (
    JSON.stringify(entry, replacer, prettyPrint ? 2 : undefined)
  ),
);
