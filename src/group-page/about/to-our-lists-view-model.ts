import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { OurListsViewModel } from './render-lists';
import { List } from '../../shared-read-models/lists';

const maxSlimlineCards = 3;

const truncatedView = <T>(slimlineCards: ReadonlyArray<T>, groupSlug: string) => (
  {
    slimlineCards: RA.takeLeft(maxSlimlineCards)(slimlineCards),
    viewAllListsUrl: O.some(`/groups/${groupSlug}/lists`),
  }
);

type ToOurListsViewModel = (groupSlug: string) => (lists: ReadonlyArray<List>) => OurListsViewModel;

export const toOurListsViewModel: ToOurListsViewModel = (groupSlug) => (lists) => pipe(
  lists,
  RA.map((list) => ({
    articleCount: list.articleCount,
    href: `/lists/${list.id}`,
    title: list.name,
    lastUpdated: list.lastUpdated,
  })),
  (slimlineCards) => (slimlineCards.length > maxSlimlineCards
    ? truncatedView(slimlineCards, groupSlug)
    : { slimlineCards, viewAllListsUrl: O.none }
  ),
);
