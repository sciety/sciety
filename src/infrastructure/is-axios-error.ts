import { AxiosError } from 'axios';

export default <T>(error: unknown): error is AxiosError<T> => (
  typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'isAxiosError')
);
