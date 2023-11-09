import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import * as O from 'fp-ts/Option';
import { toErrorHtmlDocument } from '../html-pages/to-error-html-document';
import { detectClientClassification } from './detect-client-classification';

export const sendErrorHtmlResponse = (
  context: ParameterizedContext,
  statusCode: StatusCodes,
  errorMessage: string,
): void => {
  context.response.status = statusCode;
  context.response.body = toErrorHtmlDocument(
    errorMessage,
    detectClientClassification(context),
    O.none,
  );
};
