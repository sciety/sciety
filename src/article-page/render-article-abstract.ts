import { Result } from 'true-myth';
import Doi from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GetArticleAbstract<E> = (doi: Doi) => Promise<Result<SanitisedHtmlFragment, E>>;

type RenderArticleAbstract<E> = (doi: Doi) => Promise<Result<HtmlFragment, E>>;

export default <E> (getArticleAbstract: GetArticleAbstract<E>): RenderArticleAbstract<E> => (
  async (doi) => (
    (await getArticleAbstract(doi)).map((articleAbstract) => toHtmlFragment(`
      <section class="article-abstract" role="doc-abstract">
        <h2>
          Abstract
        </h2>
          ${articleAbstract}
          <a href="https://doi.org/${doi.value}" class="article-call-to-action-link">
            Read the full article
          </a>
      </section>
    `))
  )
);
