import { StatusCodes } from 'http-status-codes';

export type ErrorResponse = {
  body: { error: string },
  status: StatusCodes,
};
