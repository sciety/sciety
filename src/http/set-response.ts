import { ParameterizedContext } from 'koa';
import { HtmlResponse } from '../html-pages/construct-html-response';
import { getHttpStatusCode } from './get-http-status-code';

export const setResponse = (htmlResponse: HtmlResponse, context: ParameterizedContext): void => {
  context.response.status = getHttpStatusCode(htmlResponse);
  context.response.type = 'html';
  context.response.body = htmlResponse.content;
};
