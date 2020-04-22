import { Handler, HTTPVersion } from 'find-my-way';
import { IncomingMessage, ServerResponse } from 'http';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { FetchArticle } from '../api/fetch-article';
import templateArticlePage from '../templates/article-page';
import templatePage from '../templates/page';
import { Article } from '../types/article';

type ArticleParams = {
  [k: string]: string | undefined;
};

export default (fetchArticle: FetchArticle): Handler<HTTPVersion.V1> => (
  (request: IncomingMessage, response: ServerResponse, params: ArticleParams): void => {
    if (typeof params.id === 'undefined') {
      response.writeHead(INTERNAL_SERVER_ERROR);
      response.end('DOI `id` parameter not present');
      return;
    }
    const doi = decodeURIComponent(params.id);
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    let article: Article;
    try {
      article = fetchArticle(doi);
    } catch (e) {
      response.writeHead(NOT_FOUND);
      response.end(`${doi} not found`);
      return;
    }

    const page = templatePage(templateArticlePage(article));
    response.writeHead(OK);
    response.end(page);
  }
);
