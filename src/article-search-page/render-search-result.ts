import Doi from '../data/doi';

export interface SearchResult {
  doi: string;
  title: string;
  authorString: string;
}

export type GetCommentCount = (doi: Doi) => Promise<number>;

export type RenderSearchResult = (result: SearchResult) => Promise<string>;

export default (
  getCommentCount: GetCommentCount,
  getReviewCount: (articleVersionDoi: Doi) => number,
): RenderSearchResult => (
  async (result) => {
    const doi = new Doi(result.doi);
    const reviewCount = getReviewCount(doi);
    const commentCount = await getCommentCount(doi).catch(() => 'n/a');

    return `
      <div class="content">
        <a class="header" href="/articles/${result.doi}">${result.title}</a>
        <div class="meta">
          ${result.authorString}
        </div>
        <div class="extra">
          <div class="ui label">
            Reviews
            <span class="detail">${reviewCount}</span>
          </div>
          <div class="ui label">
            Comments
            <span class="detail">${commentCount}</span>
          </div>
        </div>
      </div>
    `;
  }
);
