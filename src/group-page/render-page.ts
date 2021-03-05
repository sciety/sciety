import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

export type RenderPage = (
  group: Group,
  userId: O.Option<UserId>
) => TE.TaskEither<RenderPageError, Page>;

type RenderPageHeader = (group: Group) => HtmlFragment;

type RenderDescription = (group: Group) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type RenderFeed = (group: Group, userId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;

type Components = {
  header: HtmlFragment,
  description: HtmlFragment,
  feed: string,
  followers: HtmlFragment,
};

const render = (components: Components) => `
  <div class="sciety-grid sciety-grid--group">
    ${components.header}
    <div class="group-page-description">
    ${components.description}
    </div>
    <div class="group-page-side-bar">
      ${components.followers}
      ${components.feed}
    </div>
  </div>
`;

export const renderErrorPage = (): RenderPageError => ({
  type: 'unavailable' as const,
  message: toHtmlFragment('We couldn\'t retrieve this information. Please try again.'),
});

const asPage = (group: Group) => (components: Components) => ({
  title: group.name,
  content: pipe(components, render, toHtmlFragment),
});

export const renderPage = (
  renderPageHeader: RenderPageHeader,
  renderDescription: RenderDescription,
  renderFeed: RenderFeed,
  renderFollowers: (groupId: GroupId) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>,
): RenderPage => (group, userId) => pipe(
  {
    header: TE.right(renderPageHeader(group)),
    description: renderDescription(group),
    followers: renderFollowers(group.id),
    feed: renderFeed(group, userId),
  },
  sequenceS(TE.taskEither),
  TE.bimap(renderErrorPage, asPage(group)),
);
