import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { OurListsViewModel } from './render-lists';
import { List } from '../../shared-read-models/lists';
import { toListCardViewModel } from '../lists/to-list-card-view-model';

const maxSlimlineCards = 3;

type ToOurListsViewModel = (lists: ReadonlyArray<List>) => OurListsViewModel;

export const toOurListsViewModel: ToOurListsViewModel = (lists) => pipe(
  lists,
  RA.map(toListCardViewModel),
  (slimlineCards) => (slimlineCards.length > maxSlimlineCards
    ? { slimlineCards: RA.takeLeft(maxSlimlineCards)(slimlineCards), viewAllListsUrl: O.some('') }
    : { slimlineCards, viewAllListsUrl: O.none }
  ),
);
