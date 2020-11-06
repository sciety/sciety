import { Result } from 'true-myth';
import Doi from '../types/doi';

export type GetArticleAbstract<E> = (doi: Doi) => Promise<Result<string, E>>;

type RenderArticleAbstract<E> = (doi: Doi) => Promise<Result<string, E>>;

export default <E> (getArticleAbstract: GetArticleAbstract<E>): RenderArticleAbstract<E> => (
  async (doi) => (
    (await getArticleAbstract(doi)).map((articleAbstract) => `
      <section class="article-abstract" role="doc-abstract">
        <h2>
          Abstract
        </h2>
          ${articleAbstract}
          <a href="https://doi.org/${doi.value}" class="article-call-to-action-link">
            Read the full article
          </a>
      </section>
    `)
  )
);
