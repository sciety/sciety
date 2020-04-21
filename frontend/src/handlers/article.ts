import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK, NOT_FOUND } from 'http-status-codes';
import article1 from '../data/article1';
import article2 from '../data/article2';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';

export default (): Handler<HTTPVersion.V1> => {
  const allArticles = [
    article1,
    article2,
  ];
  return (request: IncomingMessage, response: ServerResponse, params: any): void => {
    const doi = decodeURIComponent(params.id);
    const matches = allArticles.filter((article) => article.doi === doi);
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    if (matches.length !== 1) {
      response.writeHead(NOT_FOUND);
      response.end(`${doi} not found`);
    } else {
      const page = templatePage(templateArticlePage(matches[0]));
      response.writeHead(OK);
      response.end(page);
    }
  };
};
