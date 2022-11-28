import { Functor1 } from 'fp-ts/Functor';
import { Kind, URIS } from 'fp-ts/HKT';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { populateArticleActivities } from './populate-article-activities';
import { ArticleCardViewModel } from './render-content-with-pagination';
import { toPageOfCards, Ports as ToPageOfCardsPorts } from './to-page-of-cards';
import { DomainEvent } from '../../domain-events';
import { PageOfItems, paginate } from '../../shared-components/paginate';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

export type Ports = ToPageOfCardsPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type ModifyPageItemsF = <F extends URIS>(FT: Functor1<F>)
=> <A, B>(f: (a: ReadonlyArray<A>) => Kind<F, ReadonlyArray<B>>,)
=> (pageOfItems: PageOfItems<A>)
=> Kind<F, PageOfItems<B>>;

export const modifyPageItemsF: ModifyPageItemsF = (FT) => (mod) => (pageOfItems) => pipe(
  pageOfItems.items,
  mod,
  (fa) => FT.map(fa, (modifiedItems) => ({
    ...pageOfItems,
    items: modifiedItems,
  })),
  (foo) => foo,
);

const modifyPageItemsTaskEither = <A, B, E>(
  f: (a: ReadonlyArray<A>) => TE.TaskEither<E, ReadonlyArray<B>>,
) => (pageOfItems: PageOfItems<A>): TE.TaskEither<E, PageOfItems<B>> => pipe(
    pageOfItems.items,
    f,
    TE.map((modifiedItems) => ({
      ...pageOfItems,
      items: modifiedItems,
    })),
  );

export const articlesList = (
  ports: Ports,
  listId: ListId,
  pageNumber: number,
  hasArticleControls: boolean,
  listOwnerId: ListOwnerId,
) => (articleIds: ReadonlyArray<Doi>): TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', PageOfItems<ArticleCardViewModel>> => pipe(
  articleIds,
  paginate(20, pageNumber),
  TE.fromEither,
  TE.chainTaskK(modifyPageItemsF(T.ApplicativePar)(populateArticleActivities(ports))),
  TE.chainW(modifyPageItemsTaskEither(toPageOfCards(ports, hasArticleControls, listId, listOwnerId))),
);
