import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchCrossrefArticle } from '../../api/fetch-crossref-article';
import Doi from '../../data/doi';
import createLogger from '../../logger';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import ReviewReferenceRepository from '../../types/review-reference-repository';
import renderPage, { FetchReviews } from '../render-page';
import { GetCommentCount } from '../render-page-header';

const biorxivPrefix = '10.1101';

export default (
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: FetchCrossrefArticle,
  fetchReviews: FetchReviews,
  reviewReferenceRepository: ReviewReferenceRepository,
): Middleware => {
  const log = createLogger('middleware:render-article-page');
  let doi: Doi;
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    try {
      doi = new Doi(ctx.params.doi || '');
    } catch (error) {
      log(`Article ${ctx.params.doi} not found: (${error})`);
      throw new NotFound(`${ctx.params.doi} not found`);
    }
    if (!(doi.hasPrefix(biorxivPrefix))) {
      log(`Article ${doi} is not from bioRxiv`);
      throw new NotFound('Not a bioRxiv DOI.');
    }
    ctx.response.body = await renderPage(
      doi,
      fetchReviews,
      editorialCommunities,
      getCommentCount,
      fetchArticle,
      fetchArticle,
      reviewReferenceRepository,
    );

    await next();
  };
};
