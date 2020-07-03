import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
  RenderEndorsedArticles,
} from './render-endorsed-articles';
import createRenderPage, { FetchArticle } from './render-page';
import { Adapters } from '../types/adapters';

const raiseFetchArticleErrors = (fetchArticle: Adapters['fetchArticle']): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);

    return result.unsafelyUnwrap();
  }
);

const buildRenderEndorsedArticles = (fetchArticle: FetchArticle): RenderEndorsedArticles => {
  const getArticleTitle: GetArticleTitle = async (articleDoi) => {
    const article = await fetchArticle(articleDoi);
    return article.title;
  };
  const getEndorsedArticles = createGetHardCodedEndorsedArticles(getArticleTitle);
  return createRenderEndorsedArticles(getEndorsedArticles);
};

// there should be a clean separation between:
// - knowledge of Koa
// - creation of page and its adapters
export default (adapters: Adapters): Middleware => {
  const fetchArticle = raiseFetchArticleErrors(adapters.fetchArticle);
  const renderEndorsedArticles = buildRenderEndorsedArticles(fetchArticle);

  const renderPage = createRenderPage(
    fetchArticle,
    adapters.reviewReferenceRepository,
    adapters.editorialCommunities,
    renderEndorsedArticles,
  );

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.params.id);
    await next();
  };
};
