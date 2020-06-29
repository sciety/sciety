import templateDate from '../templates/date';
import Doi from '../types/doi';

export interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
  postedDate: Date;
}

export type GetCommentCount = (doi: Doi) => Promise<number>;
export class GetCommentCountError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'GetCommentCountError';
  }
}
export type GetReviewCount = (doi: Doi) => Promise<number>;
export type GetEndorsingEditorialCommunities = (doi: Doi) => Promise<Array<string>>;

export type RenderSearchResult = (result: SearchResult) => Promise<string>;

const createRenderReviews = (
  getReviewCount: GetReviewCount,
) => (
  async (doi: Doi): Promise<string> => {
    const reviewCount = await getReviewCount(doi);
    if (reviewCount === 0) {
      return '';
    }
    return `
      <div class="ui label">
        Reviews
        <span class="detail">${reviewCount}</span>
      </div>
    `;
  }
);

const createRenderComments = (
  getCommentCount: GetCommentCount,
) => (
  async (doi: Doi): Promise<string> => {
    let commentCount: number;
    try {
      commentCount = await getCommentCount(doi);
    } catch (e) {
      if (e instanceof GetCommentCountError) {
        return '';
      }
      // this should become:
      //   throw e;
      // as the component doesn't deal with exceptions that doesn't know how to handle
      return '';
    }

    if (commentCount === 0) {
      return '';
    }

    return `
      <div class="ui label">
        Comments
        <span class="detail">${commentCount}</span>
      </div>
    `;
  }
);

const createRenderEndorsements = (
  getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities,
) => (
  async (doi: Doi): Promise<string> => {
    const endorsingEditorialCommunities = await getEndorsingEditorialCommunities(doi);
    if (endorsingEditorialCommunities.length === 0) {
      return '';
    }
    return `
      <div class="ui label">
        Endorsed by
        <span class="detail">${endorsingEditorialCommunities.join(', ')}</span>
      </div>
    `;
  }
);

const templatePostedDate = (date: Date): string => (
  `<div class="meta">Posted ${templateDate(date)}</div>`
);

export default (
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities,
): RenderSearchResult => {
  const renderReviews = createRenderReviews(getReviewCount);
  const renderCommentCount = createRenderComments(getCommentCount);
  const renderEndorsements = createRenderEndorsements(getEndorsingEditorialCommunities);

  return async (result) => `
    <div class="content">
      <a class="header" href="/articles/${result.doi.value}">${result.title}</a>
      <div class="meta">
        ${result.authors}
      </div>
      ${templatePostedDate(result.postedDate)}
      <div class="extra">
        ${await renderReviews(result.doi)}
        ${await renderCommentCount(result.doi)}
        ${await renderEndorsements(result.doi)}
      </div>
    </div>
  `;
};
