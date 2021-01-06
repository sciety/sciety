import { sequenceS } from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type Page = {
  title: string,
  content: HtmlFragment
};

export type RenderPage = (userId: O.Option<UserId>) => T.Task<Result<Page, never>>;

type Component = (userId: O.Option<UserId>) => T.Task<string>;

const render = (components: {
  header: string,
  feed: string,
  searchForm: string,
  editorialCommunities: string,
}): string => `
  <div class="sciety-grid sciety-grid--home">
    ${components.header}
    <div class="home-page-feed-container">
      ${components.feed}
    </div>
    <div class="home-page-side-bar">
      ${components.searchForm}
      ${components.editorialCommunities}
    </div>
  </div>
`;

export default (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderSearchForm: Component,
  renderFeed: Component,
): RenderPage => (userId) => {
  const components = {
    header: renderPageHeader(userId),
    feed: renderFeed(userId),
    searchForm: renderSearchForm(userId),
    editorialCommunities: renderEditorialCommunities(userId),
  };
  return pipe(
    {
      title: T.of('Sciety: where research is evaluated and curated by the communities you trust'),
      content: pipe(
        components,
        sequenceS(T.task),
        T.map(render),
        T.map(toHtmlFragment),
      ),
    },
    sequenceS(T.task),
    T.map((p) => Result.ok(p)),
  );
};
