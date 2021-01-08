import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { RenderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

type PageResult = {
  title: string,
  content: HtmlFragment,
};
export type RenderPage = (query: string) => T.Task<Result<PageResult, RenderPageError>>;

export default (
  renderSearchResults: RenderSearchResults,
): RenderPage => (query) => pipe(
  TE.tryCatch(
    renderSearchResults(query),
    () => Result.err<PageResult, RenderPageError>({
      type: 'unavailable',
      message: toHtmlFragment(`
        We’re having trouble searching for you, please come back later.
      `),
    }),
  ),
  TE.map((searchResults) => Result.ok<PageResult, RenderPageError>({
    title: 'Search results',
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--simple">

        <header class="page-header">
          <h1>Search results</h1>
        </header>

        <section class="ui basic vertical segment">
          ${searchResults}
        </section>

      </div>
    `),
  })),
  TE.fold(
    (result) => T.of(result),
    (result) => T.of(result),
  ),
);
