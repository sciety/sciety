import { StatusCodes } from 'http-status-codes';

export type NonHtmlViewError = {
  status: StatusCodes,
  message: string,
};

export const toNonHtmlViewError = (
  message: NonHtmlViewError['message'],
  status: NonHtmlViewError['status'] = StatusCodes.SERVICE_UNAVAILABLE,
): NonHtmlViewError => ({
  message,
  status,
});
