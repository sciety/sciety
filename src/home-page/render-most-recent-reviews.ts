import arrayUniq from 'array-uniq';
import Doi from '../data/doi';
import { toDisplayString, toString } from '../templates/date';
import templateListItems from '../templates/list-items';

type RenderMostRecentReviews = (limit: number) => Promise<string>;

export interface RecentReview {
  articleDoi: Doi;
  articleTitle: string;
  editorialCommunityId: string;
  editorialCommunityName: string;
  added: Date;
}

export interface ReviewReference {
  articleVersionDoi: Doi;
  editorialCommunityId: string;
  added: Date;
}

export interface FetchedArticle {
  title: string;
  doi: Doi;
}

export interface EditorialCommunity {
  id: string;
  name: string;
}

export type GetReviewReferences = () => Promise<Array<ReviewReference>>;
export type FetchArticle = (doi: Doi) => Promise<FetchedArticle>;
export type GetEditorialCommunities = () => Promise<Array<EditorialCommunity>>;

export const createDiscoverMostRecentReviews = (
  reviewReferences: GetReviewReferences,
  fetchArticle: FetchArticle,
  editorialCommunities: GetEditorialCommunities,
) => (
  async (limit: number): Promise<Array<RecentReview>> => {
    const mostRecentReviewReferences = (await reviewReferences())
      .sort((a, b) => b.added.getTime() - a.added.getTime())
      .slice(0, limit);

    const articleVersionDois = arrayUniq(mostRecentReviewReferences
      .map((reviewReference) => reviewReference.articleVersionDoi));

    const articles = await Promise
      .all(articleVersionDois.map(fetchArticle))
      .then((fetchedArticles): Record<string, FetchedArticle> => (
        fetchedArticles.reduce((fetchedArticlesMap, fetchedArticle) => ({
          ...fetchedArticlesMap,
          [fetchedArticle.doi.value]: fetchedArticle,
        }), {})
      ));

    const editorialCommunityNames: Record<string, string> = (await editorialCommunities())
      .reduce((accumulator, editorialCommunity) => ({
        ...accumulator,
        [editorialCommunity.id]: editorialCommunity.name,
      }), {});

    const mostRecentReviews: Array<RecentReview> = mostRecentReviewReferences.map((reviewReference) => ({
      articleDoi: reviewReference.articleVersionDoi,
      articleTitle: articles[reviewReference.articleVersionDoi.value].title,
      editorialCommunityId: reviewReference.editorialCommunityId,
      editorialCommunityName: editorialCommunityNames[reviewReference.editorialCommunityId],
      added: reviewReference.added,
    }));

    return mostRecentReviews;
  }
);

const templateRecentReview = (review: RecentReview): string => (`
  <div class="content">
    <div class="summary">
      <a href="/articles/${review.articleDoi}">${review.articleTitle}</a>
      added by <a href="/editorial-communities/${review.editorialCommunityId}">${review.editorialCommunityName}</a>
      <time datetime="${toString(review.added)}" title="${toDisplayString(review.added)}" class="date">recently</time>
    </div>
  </div>
`);

const templateMostRecentReviews = (reviews: Array<RecentReview>): string => (`
  <section>

    <h2 class="ui header">
      Most recent reviews
    </h2>

    <ol class="ui large feed">
      ${templateListItems(reviews.map(templateRecentReview), 'event')}
    </ol>

  </section>
`);

export default (
  reviewReferences: GetReviewReferences,
  fetchArticle: FetchArticle,
  editorialCommunities: GetEditorialCommunities,
): RenderMostRecentReviews => {
  const discoverMostRecentReviews = createDiscoverMostRecentReviews(
    reviewReferences,
    fetchArticle,
    editorialCommunities,
  );

  return async (limit) => templateMostRecentReviews(await discoverMostRecentReviews(limit));
};
