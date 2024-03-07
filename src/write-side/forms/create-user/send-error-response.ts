import { ParameterizedContext } from 'koa';
import { StatusCodes } from 'http-status-codes';

export const sendErrorResponse = (context: ParameterizedContext, statusCode: StatusCodes, message: string): void => {
  context.response.status = statusCode;
  context.response.body = message;
};
