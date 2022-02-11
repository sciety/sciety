import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports } from './articles-list/articles-list';
import { DomainEvent } from '../domain-events';
import { renderComponent } from '../list-page/header/render-component';
import { renderErrorPage, renderPage } from '../list-page/render-page';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import * as DE from '../types/data-error';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

const headers = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  {
    'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': {
      name: 'High interest articles',
      description: 'Articles that have been identified as high interest by NCRC editors.',
      ownerName: 'NCRC',
      ownerHref: '/groups/ncrc',
      ownerAvatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
      lastUpdated: O.some(new Date('2021-11-24')),
      groupId: '62f9b0d0-8d43-4766-a52a-ce02af61bc6a',
    },
    '5ac3a439-e5c6-4b15-b109-92928a740812': {
      name: 'Endorsed articles',
      description: 'Articles that have been endorsed by Biophysics Colab.',
      ownerName: 'Biophysics Colab',
      ownerHref: '/groups/biophysics-colab',
      ownerAvatarPath: '/static/groups/biophysics-colab--4bbf0c12-629b-4bb8-91d6-974f4df8efb2.png',
      lastUpdated: O.some(new Date('2021-11-22T15:09:00Z')),
      groupId: '4bbf0c12-629b-4bb8-91d6-974f4df8efb2',
    },
    'c7237468-aac1-4132-9598-06e9ed68f31d': {
      name: 'Medicine',
      description: 'Medicine articles that have been evaluated by eLife.',
      ownerName: 'eLife',
      ownerHref: '/groups/elife',
      ownerAvatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
      lastUpdated: O.some(new Date('2022-02-02 11:49:54.608Z')),
      groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    },
    'cb15ef21-944d-44d6-b415-a3d8951e9e8b': {
      name: 'Cell Biology',
      description: 'Cell Biology articles that have been evaluated by eLife.',
      ownerName: 'eLife',
      ownerHref: '/groups/elife',
      ownerAvatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
      lastUpdated: O.some(new Date('2022-02-09 09:43:00Z')),
      groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    },
  },
  R.lookup(listId),
  E.fromOption(() => DE.notFound),
  E.chain((partial) => pipe(
    events,
    selectArticlesBelongingToList(listId),
    E.map((articleIds) => ({
      ...partial,
      articleCount: articleIds.length,
    })),
  )),
);

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: t.string,
});

type Params = t.TypeOf<typeof paramsCodec>;

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      ports.getAllEvents,
      T.map(headers(params.id)),
      TE.map(renderComponent),
    ),
    content: articlesList(ports, params.id, params.page),
    title: pipe(
      ports.getAllEvents,
      T.map(headers(params.id)),
      TE.map((header) => header.name),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);
