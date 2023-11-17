import { ParameterizedContext } from 'koa';
import { HtmlResponse } from '../html-pages/construct-html-response.js';
import { getHttpStatusCode } from './get-http-status-code.js';

export const sendHtmlResponse = (htmlResponse: HtmlResponse, context: ParameterizedContext): void => {
  context.response.status = getHttpStatusCode(htmlResponse.error);
  context.response.type = 'html';
  context.response.body = htmlResponse.document;
};
