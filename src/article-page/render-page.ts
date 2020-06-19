import { NotFound } from 'http-errors';
import createRenderAddReviewForm, { GetAllEditorialCommunities } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract } from './render-article-abstract';
import createRenderPageHeader, {
  GetArticleDetails,
  GetCommentCount,
  GetEndorsingEditorialCommunityNames, GetReviewCount,
} from './render-page-header';
import createRenderReviews, { GetReviews } from './render-reviews';
import { ArticlePageViewModel } from './types/article-page-view-model';
import endorsements from '../bootstrap-endorsements';
import Doi from '../data/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

type GetEditorialCommunityName = (editorialCommunityId: string) => Promise<string>;

const createGetEndorsingEditorialCommunityNames = (
  getEditorialCommunityName: GetEditorialCommunityName,
): GetEndorsingEditorialCommunityNames => (
  async (doi) => {
    const endorsingEditorialCommunityIds = endorsements[doi.value] ?? [];
    return Promise.all(endorsingEditorialCommunityIds.map(getEditorialCommunityName));
  }
);

const reviewsId = 'reviews';

export default async (
  doi: Doi,
  { article, reviews }: ArticlePageViewModel,
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: GetArticleDetails,
): Promise<string> => {
  const getArticleDetailsAdapter: GetArticleDetails = async (articleDoi) => (
    fetchArticle(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      })
  );
  const abstractAdapter: GetArticleAbstract = async () => ({ content: article.abstract });
  const reviewsAdapter: GetReviews = async () => reviews;
  const reviewCountAdapter: GetReviewCount = async () => reviews.length;
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
  return `<article class="ui aligned stackable grid">
    <div class="row">
      <div class="column">
        ${await renderPageHeader(doi)}
      </div>
    </div>

    <div class="row">
      <section class="twelve wide column">
        ${await renderArticleAbstract(doi)}
        ${await renderReviews()}
      </section>
      <aside class="four wide right floated column">
        ${await renderAddReviewForm(doi)}
      </aside>
    </div>
  </article>`;
};
