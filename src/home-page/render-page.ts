import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { RenderFeed } from './render-feed';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { UserId } from '../types/user-id';

export type RenderPage = (userId: O.Option<UserId>) => T.Task<Page>;

type Component = (userId: O.Option<UserId>) => T.Task<string>;

// TODO: should all be HtmlFragment
type Components = {
  header: string,
  feed: string,
  editorialCommunities: string,
};

const render = (components: Components) => `
  <div class="sciety-grid sciety-grid--home">
    ${components.header}
    <div class="home-page-feed-container">
      ${components.feed}
    </div>
    <div class="home-page-side-bar">
      ${components.editorialCommunities}
    </div>
  </div>
`;

const asPage = (components: Components): Page => ({
  title: 'Sciety: where research is evaluated and curated by the communities you trust',
  content: pipe(components, render, toHtmlFragment),
});

export const renderPage = (
  renderPageHeader: Component,
  renderEditorialCommunities: Component,
  renderFeed: RenderFeed,
): RenderPage => flow(
  (userId) => ({
    header: renderPageHeader(userId),
    feed: renderFeed(userId, []),
    editorialCommunities: renderEditorialCommunities(userId),
  }),
  sequenceS(T.ApplyPar),
  T.map(asPage),
);
