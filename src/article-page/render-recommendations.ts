import { Result } from 'true-myth';
import Doi from '../types/doi';

type RenderRecommendations = (doi: Doi) => Promise<Result<string, never>>;

export type GetRecommendations = (doi: Doi) => Promise<ReadonlyArray<{
  content: string,
}>>;

export default (
  getRecommendations: GetRecommendations,
): RenderRecommendations => (
  async (doi) => {
    const recommendations = (await getRecommendations(doi)).map(({ content }) => `
      <article class="content">
        <h3>
        Recommended by
        <a href="/editorial-communities/19b7464a-edbe-42e8-b7cc-04d1eb1f7332" id="review-0-editorial-community">
          Peer Community in Evolutionary Biology
        </a>
        </h3>
        <p>
          ${content}
        </p>
      </article>
    `).join('');
    return Result.ok(`
      <section id="recommendations">
        ${recommendations}
      </section>
    `);
  }
);
