import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

export const axiosError = (status: StatusCodes): AxiosError => ({
  isAxiosError: true,
  response: {
    status,
  },
} as AxiosError);
