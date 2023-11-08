import { ParameterizedContext } from 'koa';
import { HtmlResponse } from '../html-pages/construct-html-response';
import { getHttpStatusCode } from './get-http-status-code';

export const setResponseOnContext = (htmlResponse: HtmlResponse, context: ParameterizedContext): void => {
  context.response.status = getHttpStatusCode(htmlResponse.error);
  context.response.type = 'html';
  context.response.body = htmlResponse.document;
};
