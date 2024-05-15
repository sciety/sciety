import { StatusCodes } from 'http-status-codes';

export type NonHtmlViewError = {
  status: StatusCodes,
  message: string,
};
