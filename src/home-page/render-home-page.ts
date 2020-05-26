import { Context, Middleware, Next } from 'koa';
import templateMostRecentReviews from './templates/most-recent-reviews';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import ReviewReferenceRepository from '../types/review-reference-repository';

const createRenderEditorialCommunities = (allCommunities: () => Array<{ id: string; name: string }>) => (
  (): string => {
    const editorialCommunityLinks = allCommunities().map((ec) => `<a href="/editorial-communities/${ec.id}">${ec.name}</a>`);
    return `
    <section>
      <h2>
        Editorial communities
      </h2>
      <ol class="u-normalised-list">
        ${templateListItems(editorialCommunityLinks)}
      </ol>
    </section>`;
  }
);

interface RecentReview {
  articleDoi: Doi;
  articleTitle: string;
  editorialCommunityName: string;
  added: Date;
}

interface ReviewReference {
  articleVersionDoi: Doi;
  editorialCommunityId: string;
  added: Date;
}

interface FetchedArticle {
  title: string;
  doi: Doi;
}

const createDiscoverMostRecentReviews = (
  reviewReferences: () => Array<ReviewReference>,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
  editorialCommunities: () => Array<{ id: string; name: string }>,
  limit: number,
) => (
  async (): Promise<Array<RecentReview>> => {
    const mostRecentReviewReferences = reviewReferences()
      .sort((a, b) => b.added.getTime() - a.added.getTime())
      .slice(0, limit);

    const articleVersionDois = [...new Set<Doi>(mostRecentReviewReferences
      .map((reviewReference) => reviewReference.articleVersionDoi))];

    const articles = await Promise
      .all(articleVersionDois.map(fetchArticle))
      .then((fetchedArticles): Record<string, FetchedArticle> => (
        fetchedArticles.reduce((fetchedArticlesMap, fetchedArticle) => ({
          ...fetchedArticlesMap, [fetchedArticle.doi.value]: fetchedArticle,
        }), {})
      ));

    const editorialCommunityNames: Record<string, string> = editorialCommunities()
      .reduce((accumulator, editorialCommunity) => ({
        ...accumulator, [editorialCommunity.id]: editorialCommunity.name,
      }), {});

    const mostRecentReviews: Array<RecentReview> = mostRecentReviewReferences.map((reviewReference) => ({
      articleDoi: reviewReference.articleVersionDoi,
      articleTitle: articles[reviewReference.articleVersionDoi.value].title,
      editorialCommunityName: editorialCommunityNames[reviewReference.editorialCommunityId],
      added: reviewReference.added,
    }));

    return mostRecentReviews;
  }
);

type RenderMostRecentReviews = () => Promise<string>;

const createRenderMostRecentReviews = (
  reviewReferences: () => Array<ReviewReference>,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
  editorialCommunities: () => Array<{ id: string; name: string }>,
  limit: number,
): RenderMostRecentReviews => {
  const discoverMostRecentReviews = createDiscoverMostRecentReviews(
    reviewReferences,
    fetchArticle,
    editorialCommunities,
    limit,
  );

  return async (): Promise<string> => templateMostRecentReviews(await discoverMostRecentReviews());
};

export default (
  editorialCommunities: EditorialCommunityRepository,
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
): Middleware => {
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities.all);
  return async ({ response }: Context, next: Next): Promise<void> => {
    const reviewReferenceAdapter = (): Array<ReviewReference> => (
      Array.from(reviewReferenceRepository)
    );
    const renderMostRecentReviews = createRenderMostRecentReviews(
      reviewReferenceAdapter,
      fetchArticle,
      editorialCommunities.all,
      5,
    );
    response.body = `<div class="home-page">
    <header class="content-header">

    <h1>
      Untitled Publish Review Curate Platform
    </h1>

    <p>
      An experimental platform for multiple communities to provide post-publication peer review of scientific research.<br>
      <a href="/about">Learn more about the platform.</a>
    </p>

  </header>

  <form method="get" action="/articles" class="find-reviews compact-form">

    <fieldset>

      <legend class="compact-form__title">
        Find an article
      </legend>

      <div class="compact-form__row">

        <label>
          <span class="visually-hidden">Search for an article by bioRxiv DOI</span>
          <input
            type="text"
            name="doi"
            placeholder="Search for an article by bioRxiv DOI"
            class="compact-form__article-doi"
            required>
        </label>

        <button type="submit" class="compact-form__submit">
          <span class="visually-hidden">Find an article</span>
        </button>

      </div>

    </fieldset>

  </form>

  <div class="content-lists">

    ${await renderMostRecentReviews()}

    ${renderEditorialCommunities()}

  </div>
  </div>
`;

    await next();
  };
};
