import { NotFound } from 'http-errors';
import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
} from './render-endorsed-articles';
import createRenderReviewedArticles, { GetReviewedArticles } from './render-reviewed-articles';
import templateHeader from './templates/header';
import { FetchArticle } from '../api/fetch-article';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface EditorialCommunity {
  name: string;
  description: string;
  logo?: string;
}

type RenderPageHeader = (editorialCommunityId: string) => Promise<string>;

type GetEditorialCommunity = (editorialCommunityId: string) => Promise<EditorialCommunity>;

const createRenderPageHeader = (getEditorialCommunity: GetEditorialCommunity): RenderPageHeader => (
  async (editorialCommunityId) => Promise.resolve(templateHeader(await getEditorialCommunity(editorialCommunityId)))
);

type RenderPage = (editorialCommunityId: string) => Promise<string>;

export default (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
  editorialCommunities: EditorialCommunityRepository,
): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = editorialCommunities.lookup(editorialCommunityId);

    if (editorialCommunity.name === 'Unknown') {
      throw new NotFound(`${editorialCommunityId} not found`);
    }
    return editorialCommunity;
  };
  const getArticleTitle: GetArticleTitle = async (articleDoi) => {
    const article = await fetchArticle(articleDoi);
    return article.title;
  };
  const getEndorsedArticles = createGetHardCodedEndorsedArticles(getArticleTitle);
  const getReviewedArticles: GetReviewedArticles = async (editorialCommunityId) => {
    const reviewedArticleVersions = reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    return Promise.all(reviewedArticleVersions.map(fetchArticle));
  };

  return async (editorialCommunityId) => {
    const renderPageHeader = createRenderPageHeader(getEditorialCommunity);
    const renderEndorsedArticles = createRenderEndorsedArticles(getEndorsedArticles);
    const renderReviewedArticles = createRenderReviewedArticles(getReviewedArticles);

    return `
      ${await renderPageHeader(editorialCommunityId)}
      ${await renderEndorsedArticles(editorialCommunityId)}
      ${await renderReviewedArticles(editorialCommunityId)}
    `;
  };
};
