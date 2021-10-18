import { StatusCodes } from 'http-status-codes';

export type ErrorResponse = {
  body: { error: string },
  status: StatusCodes,
};

export const internalServerError: ErrorResponse = {
  body: { error: 'Internal server error while generating Docmaps' },
  status: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const badRequest = (message: string): ErrorResponse => ({
  body: { error: message },
  status: StatusCodes.BAD_REQUEST,
});
