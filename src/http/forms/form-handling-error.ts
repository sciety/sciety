import { Payload } from '../../infrastructure/logger';

export type FormHandlingError = {
  errorType?: string,
  message: string,
  payload: Payload,
};
