import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GetArticleAbstract<Err> = (doi: Doi) => TE.TaskEither<Err, SanitisedHtmlFragment>;

type RenderArticleAbstract<Err> = (doi: Doi) => TE.TaskEither<Err, HtmlFragment>;

export const createRenderArticleAbstract = <Err> (
  getArticleAbstract: GetArticleAbstract<Err>,
): RenderArticleAbstract<Err> => (
    (doi) => pipe(
      doi,
      getArticleAbstract,
      TE.map((articleAbstract) => toHtmlFragment(`
        <section class="article-abstract" role="doc-abstract">
          <h2>
            Abstract
          </h2>
            ${articleAbstract}
            <a href="https://doi.org/${doi.value}" class="article-call-to-action-link">
              Read the full article
            </a>
        </section>
      `)),
    )
  );
