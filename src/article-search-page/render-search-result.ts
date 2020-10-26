import templateDate from '../shared-components/date';
import Doi from '../types/doi';

export interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
  postedDate: Date;
}

export type GetReviewCount = (doi: Doi) => Promise<number>;

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

const templatePostedDate = (date: Date): string => (
  `<div class="meta">Posted ${templateDate(date)}</div>`
);

export default (
  getReviewCount: GetReviewCount,
): RenderSearchResult => {
  const renderReviews = createRenderReviews(getReviewCount);

  return async (result) => `
    <div class="content">
      <a class="header" href="/articles/${result.doi.value}">${result.title}</a>
      <div class="meta">
        ${result.authors}
      </div>
      ${templatePostedDate(result.postedDate)}
      <div class="extra">
        ${await renderReviews(result.doi)}
      </div>
    </div>
  `;
};
