import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GetArticleAbstract<Err> = (doi: Doi) => T.Task<Result<SanitisedHtmlFragment, Err>>;

type RenderArticleAbstract<Err> = (doi: Doi) => TE.TaskEither<Err, HtmlFragment>;

export const createRenderArticleAbstract = <Err> (
  getArticleAbstract: GetArticleAbstract<Err>,
): RenderArticleAbstract<Err> => (
    (doi) => pipe(
      doi,
      getArticleAbstract,
      T.map((result) => (
        result.mapOrElse<E.Either<Err, SanitisedHtmlFragment>>(
          E.left,
          E.right,
        )
      )),
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
