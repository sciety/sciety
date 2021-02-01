import { AxiosError } from 'axios';

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => (
  typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'isAxiosError')
);
