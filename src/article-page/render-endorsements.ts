import { Result } from 'true-myth';
import Doi from '../types/doi';

type RenderEndorsements = (doi: Doi) => Promise<Result<string, never>>;

export type GetEndorsements = (doi: Doi) => Promise<ReadonlyArray<{
  title: string,
  content: string,
}>>;

export default (
  getEndorsements: GetEndorsements,
): RenderEndorsements => (
  async (doi) => {
    const endorsements = (await getEndorsements(doi)).map(({ title, content }) => `
      <article class="content">
        <h3>
        Endorsed by
        <a href="/editorial-communities/19b7464a-edbe-42e8-b7cc-04d1eb1f7332" id="review-0-editorial-community">
          Peer Community in Evolutionary Biology
        </a>
        </h3>
        <h4>${title}</h4>
        <p>
          ${content}
        </p>
      </article>
    `).join('');
    return Result.ok(`
      <section id="endorsements">
        ${endorsements}
      </section>
    `);
  }
);
