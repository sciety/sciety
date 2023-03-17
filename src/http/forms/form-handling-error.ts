import { Payload } from '../../infrastructure/logger';

export type FormHandlingError = {
  errorType: string,
  payload: Payload,
};
