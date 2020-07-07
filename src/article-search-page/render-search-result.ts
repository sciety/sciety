import { Maybe } from 'true-myth';
import templateDate from '../templates/date';
import Doi from '../types/doi';

export interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
  postedDate: Date;
}

export type GetCommentCount = (doi: Doi) => Promise<Maybe<number>>;
export type GetReviewCount = (doi: Doi) => Promise<number>;
export type GetEndorsingEditorialCommunityNames = (doi: Doi) => Promise<Array<string>>;

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
    const commentCount = (await getCommentCount(doi)).unwrapOr(0);

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
  getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames,
) => (
  async (doi: Doi): Promise<string> => {
    const endorsingEditorialCommunities = await getEndorsingEditorialCommunityNames(doi);
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
  getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames,
): RenderSearchResult => {
  const renderReviews = createRenderReviews(getReviewCount);
  const renderCommentCount = createRenderComments(getCommentCount);
  const renderEndorsements = createRenderEndorsements(getEndorsingEditorialCommunityNames);

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
