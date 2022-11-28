import {
  Functor, Functor1, Functor2,
} from 'fp-ts/Functor';
import {
  HKT, Kind, Kind2, URIS, URIS2,
} from 'fp-ts/HKT';
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

// HKT Boilerplate needed to support different Functors e.g. Task and TaskEither
function modifyPageItemsF<F extends URIS2>(FA: Functor2<F>):
<A, B, E>(mod: (a: ReadonlyArray<A>) => Kind2<F, E, ReadonlyArray<B>>)
=> (pageOfItems: PageOfItems<A>)
=> Kind2<F, E, PageOfItems<B>>;
function modifyPageItemsF<F extends URIS>(FA: Functor1<F>):
<A, B>(mod: (a: ReadonlyArray<A>) => Kind<F, ReadonlyArray<B>>)
=> (pageOfItems: PageOfItems<A>)
=> Kind<F, PageOfItems<B>>;
function modifyPageItemsF<F>(FA: Functor<F>):
<A, B>(mod: (a: ReadonlyArray<A>) => HKT<F, ReadonlyArray<B>>)
=> (pageOfItems: PageOfItems<A>)
=> HKT<F, PageOfItems<B>>;

// Actual implementation. Read this instead of the boilerplate.
function modifyPageItemsF<F>(FA: Functor<F>):
<A, B>(mod: (a: ReadonlyArray<A>) => HKT<F, ReadonlyArray<B>>)
=> (pageOfItems: PageOfItems<A>)
=> HKT<F, PageOfItems<B>> {
  return (mod) => (pageOfItems) => pipe(
    pageOfItems.items,
    mod,
    (fa) => FA.map(fa, (modifiedItems) => ({
      ...pageOfItems,
      items: modifiedItems,
    })),
  );
}

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
  TE.chainW(modifyPageItemsF(TE.ApplicativePar)(toPageOfCards(ports, hasArticleControls, listId, listOwnerId))),
);
