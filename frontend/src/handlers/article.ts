import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';
import fetchArticle from './fetch-article';

type ArticleParams = {
  [k: string]: string | undefined;
};

export default (): Handler<HTTPVersion.V1> => (
  (request: IncomingMessage, response: ServerResponse, params: ArticleParams): void => {
    if (typeof params.id === 'undefined') {
      response.writeHead(INTERNAL_SERVER_ERROR);
      response.end('DOI `id` parameter not present');
      return;
    }
    const doi = decodeURIComponent(params.id);
    const article = fetchArticle(doi);
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    if (article) {
      const page = templatePage(templateArticlePage(article));
      response.writeHead(OK);
      response.end(page);
    } else {
      response.writeHead(NOT_FOUND);
      response.end(`${doi} not found`);
    }
  }
);
