import { Context, Middleware, Next } from 'koa';
import templateMostRecentReviews from './templates/most-recent-reviews';
import Doi from '../data/doi';
import templateListItems from '../templates/list-items';

type RenderEditorialCommunities = () => Promise<string>;

const createRenderEditorialCommunities = (
  allCommunities: () => Promise<Array<{ id: string; name: string }>>,
): RenderEditorialCommunities => (
  async () => {
    const editorialCommunityLinks = (await allCommunities()).map((ec) => `<a href="/editorial-communities/${ec.id}">${ec.name}</a>`);
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

export interface RecentReview {
  articleDoi: Doi;
  articleTitle: string;
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

export const createDiscoverMostRecentReviews = (
  reviewReferences: () => Promise<Array<ReviewReference>>,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
  editorialCommunities: () => Promise<Array<EditorialCommunity>>,
  limit: number,
) => (
  async (): Promise<Array<RecentReview>> => {
    const mostRecentReviewReferences = (await reviewReferences())
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

    const editorialCommunityNames: Record<string, string> = (await editorialCommunities())
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
  reviewReferences: () => Promise<Array<ReviewReference>>,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
  editorialCommunities: () => Promise<Array<EditorialCommunity>>,
  limit: number,
): RenderMostRecentReviews => {
  const discoverMostRecentReviews = createDiscoverMostRecentReviews(
    reviewReferences,
    fetchArticle,
    editorialCommunities,
    limit,
  );

  return async () => templateMostRecentReviews(await discoverMostRecentReviews());
};

type RenderFindArticle = () => Promise<string>;

const createRenderFindArticle = (): RenderFindArticle => (
  async () => (`
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
  `)
);

type RenderPageHeader = () => Promise<string>;

const createRenderPageHeader = (): RenderPageHeader => (
  async () => (`
    <header class="content-header">

      <h1>
        Untitled Publish Review Curate Platform
      </h1>

      <p>
        An experimental platform for multiple communities to provide post-publication peer review of scientific
        research.<br><a href="/about">Learn more about the platform.</a>
      </p>

    </header>
  `)
);

export default (
  editorialCommunities: () => Promise<Array<EditorialCommunity>>,
  reviewReferences: () => Promise<Array<ReviewReference>>,
  fetchArticle: (doi: Doi) => Promise<FetchedArticle>,
): Middleware => {
  const renderPageHeader = createRenderPageHeader();
  const renderEditorialCommunities = createRenderEditorialCommunities(editorialCommunities);
  const renderFindArticle = createRenderFindArticle();
  const renderMostRecentReviews = createRenderMostRecentReviews(
    reviewReferences,
    fetchArticle,
    editorialCommunities,
    5,
  );
  return async ({ response }: Context, next: Next): Promise<void> => {
    response.body = `
      <div class="home-page">
        ${await renderPageHeader()}
        ${await renderFindArticle()}
        <div class="content-lists">
          ${await renderMostRecentReviews()}
          ${await renderEditorialCommunities()}
        </div>
      </div>
    `;

    await next();
  };
};
