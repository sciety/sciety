import { ParameterizedContext } from 'koa';
import { getHttpStatusCode } from './get-http-status-code';
import { HtmlResponse } from '../html-pages/construct-html-response';

export const sendHtmlResponse = (context: ParameterizedContext) => (htmlResponse: HtmlResponse): void => {
  context.response.status = getHttpStatusCode(htmlResponse.error);
  context.response.type = 'html';
  context.response.body = htmlResponse.document;
};
