import createRenderEndorsedArticles, {
  createGetHardCodedEndorsedArticles,
  GetArticleTitle,
} from './render-endorsed-articles';
import createRenderReviewedArticles, { GetReviewedArticles } from './render-reviewed-articles';
import templateHeader from './templates/header';
import { FetchArticle } from '../api/fetch-article';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface EditorialCommunity {
  name: string;
  description: string;
  logo?: string;
}

interface ReviewedArticles {
  reviewedArticles: Array<{
    doi: Doi;
    title: string;
  }>;
}

type RenderPageHeader = (editorialCommunity: EditorialCommunity) => Promise<string>;

const createRenderPageHeader = (): RenderPageHeader => (
  async (editorialCommunity) => Promise.resolve(templateHeader(editorialCommunity))
);

type RenderPage = (
  editorialCommunityId: string,
  viewModel: EditorialCommunity & ReviewedArticles,
) => Promise<string>;

export default (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
): RenderPage => {
  const getReviewedArticles: GetReviewedArticles = async (editorialCommunityId) => {
    const reviewedArticleVersions = reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunityId)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    return Promise.all(reviewedArticleVersions.map(fetchArticle));
  };
  return async (editorialCommunityId, viewModel) => {
    const renderPageHeader = createRenderPageHeader();
    const getArticleTitle: GetArticleTitle = async (articleDoi) => {
      const article = await fetchArticle(articleDoi);
      return article.title;
    };
    const renderEndorsedArticles = createRenderEndorsedArticles(createGetHardCodedEndorsedArticles(getArticleTitle));
    const renderReviewedArticles = createRenderReviewedArticles(getReviewedArticles);

    return `
      ${await renderPageHeader(viewModel)}
      ${await renderEndorsedArticles(editorialCommunityId)}
      ${await renderReviewedArticles(editorialCommunityId)}
    `;
  };
};
