import { Payload } from '../../infrastructure/logger';

export type FormHandlingError<T> = {
  errorType: T,
  payload: Payload,
};
