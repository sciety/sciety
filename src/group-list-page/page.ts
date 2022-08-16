import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Ports } from './articles-list/articles-list';
import { renderComponent } from './header/render-component';
import { renderErrorPage, renderPage } from './render-page';
import { DomainEvent } from '../domain-events';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles';
import { getList } from '../shared-read-models/lists';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { toHtmlFragment } from '../types/html-fragment';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';

type Owner = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

const getOwnerThatIsUser = (userId: UserId): E.Either<unknown, Owner> => E.right({
  ownerName: 'owner-name',
  ownerHref: 'owner-slug',
  ownerAvatarPath: 'owner-avatar-path',
});

const headers = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  getList(listId),
  TE.chainEitherK((partial) => pipe(
    events,
    selectArticlesBelongingToList(listId),
    E.map((articleIds) => ({
      ...partial,
      articleCount: articleIds.length,
    })),
  )),
  TE.chainEitherK((partial) => pipe(
    events,
    getGroup(partial.ownerId),
    E.map((group) => ({
      ...partial,
      ownerName: group.name,
      ownerHref: `/groups/${group.slug}`,
      ownerAvatarPath: group.avatarPath,
    })),
    E.alt(() => pipe(
      partial.ownerId,
      getOwnerThatIsUser,
      E.map((owner) => ({
        ...partial,
        ...owner,
      })),
    )),
    E.alt(() => E.right({
      ...partial,
      ownerName: 'owner-name',
      ownerHref: 'owner-slug',
      ownerAvatarPath: 'owner-avatar-path',
    })),
  )),
);

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
});

type Params = t.TypeOf<typeof paramsCodec>;

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      ports.getAllEvents,
      T.chain(headers(params.id)),
      TE.map(renderComponent),
    ),
    // content: articlesList(ports, params.id, params.page),
    // title: pipe(
    //   ports.getAllEvents,
    //   T.chain(headers(params.id)),
    //   TE.map((header) => header.name),
    // ),
    content: TE.right(toHtmlFragment('')),
    title: TE.right(''),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
