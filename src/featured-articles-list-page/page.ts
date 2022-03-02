import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports } from './articles-list/articles-list';
import { DomainEvent } from '../domain-events';
import { renderComponent } from '../list-page/header/render-component';
import { renderErrorPage, renderPage } from '../list-page/render-page';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import { getList } from '../shared-read-models/lists';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

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
    content: articlesList(ports, params.id, params.page),
    title: pipe(
      ports.getAllEvents,
      T.chain(headers(params.id)),
      TE.map((header) => header.name),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
