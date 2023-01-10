import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { card1, card2, card3 } from './hardcoded-user-list-cards';
import { renderCardsSection } from './render-cards-section';
import { Ports, userListCard } from './user-list-card';
import { HtmlFragment } from '../../../types/html-fragment';

export const cards = (ports: Ports): T.Task<HtmlFragment> => pipe(
  {
    first: userListCard({ ...ports, getUser: () => O.some(card1) })(
      card1.id,
      card1.description,
    ),
    second: userListCard({ ...ports, getUser: () => O.some(card2) })(
      card2.id,
      card2.description,
    ),
    third: userListCard({ ...ports, getUser: () => O.some(card3) })(
      card3.id,
      card3.description,
    ),
  },
  sequenceS(TE.ApplyPar),
  T.map(renderCardsSection),
);
