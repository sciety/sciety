import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { contentComponent, Ports as ContentComponentPorts, TabIndex } from './content-component';
import { DomainEvent } from '../../domain-events';
import { GetGroupBySlug } from '../../shared-ports';
import { isFollowing } from '../../shared-read-models/followings';
import { UserIdFromString } from '../../types/codecs/UserIdFromString';
import * as DE from '../../types/data-error';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html/render-as-html';
import { renderErrorPage } from './render-as-html/render-error-page';

type Ports = ContentComponentPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  getGroupBySlug: GetGroupBySlug,
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

type GroupPage = (
  ports: Ports
) => (
  activeTabIndex: TabIndex
) => (
  params: Params
) => TE.TaskEither<RenderPageError, Page>;

export const groupPage: GroupPage = (ports) => (activeTabIndex) => ({ slug, user, page: pageNumber }) => pipe(
  ports.getGroupBySlug(slug),
  E.fromOption(() => DE.notFound),
  TE.fromEither,
  TE.chain((group) => pipe(
    {
      group: TE.right(group),
      isFollowing: pipe(
        user,
        O.fold(
          () => T.of(false),
          (u) => pipe(
            ports.getAllEvents,
            T.map(isFollowing(u.id, group.id)),
          ),
        ),
        TE.rightTask,
      ),
      content: contentComponent(ports)(group, pageNumber, activeTabIndex),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.bimap(renderErrorPage, renderAsHtml),
);
