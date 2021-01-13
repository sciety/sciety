import * as TE from 'fp-ts/lib/TaskEither';
import { flow } from 'fp-ts/lib/function';
import { RenderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

type PageResult = {
  title: string,
  content: HtmlFragment,
};
export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, PageResult>;

export default (renderSearchResults: RenderSearchResults): RenderPage => flow(
  renderSearchResults,
  TE.mapLeft(
    (error) => ({
      type: error,
      message: toHtmlFragment('We\'re having trouble searching for you, please come back later.'),
    }),
  ),
  TE.map((searchResults) => ({
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
);
