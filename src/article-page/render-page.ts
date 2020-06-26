import { NotFound, ServiceUnavailable } from 'http-errors';
import createRenderAddReviewForm, { GetAllEditorialCommunities } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract } from './render-article-abstract';
import createRenderPageHeader, {
  GetArticleDetails,
  GetCommentCount,
  GetEndorsingEditorialCommunityNames, GetReviewCount,
} from './render-page-header';
import createRenderReviews, { GetReviews } from './render-reviews';
import { FetchDatasetError } from '../api/fetch-dataset';
import endorsements from '../bootstrap-endorsements';
import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

type RenderPage = (doi: Doi) => Promise<string>;

type GetEditorialCommunityName = (editorialCommunityId: string) => Promise<string>;

const createGetEndorsingEditorialCommunityNames = (
  getEditorialCommunityName: GetEditorialCommunityName,
): GetEndorsingEditorialCommunityNames => (
  async (doi) => {
    const endorsingEditorialCommunityIds = endorsements[doi.value] ?? [];
    return Promise.all(endorsingEditorialCommunityIds.map(getEditorialCommunityName));
  }
);

type GetFullArticle = (doi: Doi) => Promise<{
  abstract: string;
}>;

export type FetchReviews = (doi: Doi) => Promise<Array<{
  publicationDate: Date;
  summary: string;
  url: URL;
  editorialCommunityId: string;
  editorialCommunityName: string;
}>>;

const reviewsId = 'reviews';

export default (
  fetchReviews: FetchReviews,
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: GetArticleDetails,
  fetchAbstract: GetFullArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
): RenderPage => {
  const getArticleDetailsAdapter: GetArticleDetails = async (articleDoi) => (
    fetchArticle(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      })
  );
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      });
    return { content: fetchedArticle.abstract };
  };
  const reviewsAdapter: GetReviews = async (articleDoi) => (
    fetchReviews(articleDoi)
      .catch((error) => {
        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }
        throw new NotFound(`${articleDoi} not found`);
      })
  );
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => editorialCommunities.all();
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    editorialCommunities.lookup(editorialCommunityId).name
  );
  const renderPageHeader = createRenderPageHeader(
    getArticleDetailsAdapter,
    reviewCountAdapter,
    getCommentCount,
    createGetEndorsingEditorialCommunityNames(getEditorialCommunityName),
    `#${reviewsId}`,
  );
  const renderArticleAbstract = createRenderArticleAbstract(abstractAdapter);
  const renderReviews = createRenderReviews(reviewsAdapter, reviewsId);
  const renderAddReviewForm = createRenderAddReviewForm(editorialCommunitiesAdapter);
  return async (doi) => (
    `<article class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          ${await renderPageHeader(doi)}
        </div>
      </div>

      <div class="row">
        <section class="twelve wide column">
          ${await renderArticleAbstract(doi)}
          ${await renderReviews(doi)}
        </section>
        <aside class="four wide right floated column">
          ${await renderAddReviewForm(doi)}
        </aside>
      </div>
    </article>`
  );
};
