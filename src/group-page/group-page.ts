import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { contentComponent, Ports as ContentComponentPorts, TabIndex } from './content-component';
import { follows } from './follows';
import { renderErrorPage, renderPage } from './render-page';
import { renderPageHeader } from './render-page-header';
import { DomainEvent } from '../domain-events';
import { renderFollowToggle } from '../follow/render-follow-toggle';
import { getGroupBySlug } from '../shared-read-models/groups';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Ports = ContentComponentPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const groupPageTabs: Record<string, TabIndex> = {
  lists: 0,
  about: 1,
  followers: 2,
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
  page: tt.withFallback(tt.NumberFromString, 1),
});

type Params = t.TypeOf<typeof paramsCodec>;

const notFoundResponse = () => ({
  type: DE.notFound,
  message: toHtmlFragment('No such group. Please check and try again.'),
} as const);

type GroupPage = (
  ports: Ports
) => (
  activeTabIndex: TabIndex
) => (
  params: Params
) => TE.TaskEither<RenderPageError, Page>;

export const groupPage: GroupPage = (ports) => (activeTabIndex) => ({ slug, user, page: pageNumber }) => pipe(
  ports.getAllEvents,
  T.map(getGroupBySlug(slug)),
  TE.mapLeft(notFoundResponse),
  TE.chain((group) => pipe(
    {
      header: pipe(
        group,
        renderPageHeader,
        TE.right,
      ),
      followButton: pipe(
        user,
        O.fold(
          () => T.of(false),
          (u) => pipe(
            ports.getAllEvents,
            T.map(follows(u.id, group.id)),
          ),
        ),
        T.map(renderFollowToggle(group.id, group.name)),
        TE.rightTask,
      ),
      content: contentComponent(ports)(group, pageNumber, activeTabIndex),
    },
    sequenceS(TE.ApplyPar),
    TE.bimap(renderErrorPage, renderPage(group)),
  )),
);
