import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK } from 'http-status-codes';
import article2 from '../data/article2';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const page = templatePage(templateArticlePage(article2));
  return (request: IncomingMessage, response: ServerResponse): void => {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.writeHead(OK);
    response.end(page);
  };
};
