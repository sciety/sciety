import Doi from '../data/doi';

export interface SearchResult {
  doi: Doi;
  title: string;
  authors: string;
}

export type GetCommentCount = (doi: Doi) => Promise<number>;
export type GetReviewCount = (doi: Doi) => Promise<number>;
export type GetEndorsingEditorialCommunities = (doi: Doi) => Promise<Array<string>>;

export type RenderSearchResult = (result: SearchResult) => Promise<string>;

const createRenderEndorsements = (
  getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities,
) => (
  async (doi: Doi): Promise<string> => {
    const endorsingEditorialCommunities = await getEndorsingEditorialCommunities(doi);
    if (endorsingEditorialCommunities.length) {
      return `
        <div class="ui label">
          Endorsed by
          <span class="detail">${endorsingEditorialCommunities.join(', ')}</span>
        </div>
      `;
    }
    return '';
  }
)

export default (
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEndorsingEditorialCommunities: GetEndorsingEditorialCommunities,
): RenderSearchResult => (
  async (result) => {
    const reviewCount = await getReviewCount(result.doi);
    const commentCount = await getCommentCount(result.doi).catch(() => 'n/a');
    const renderEndorsements = createRenderEndorsements(getEndorsingEditorialCommunities);

    return `
      <div class="content">
        <a class="header" href="/articles/${result.doi.value}">${result.title}</a>
        <div class="meta">
          ${result.authors}
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
          ${await renderEndorsements(result.doi)}
        </div>
      </div>
    `;
  }
);
