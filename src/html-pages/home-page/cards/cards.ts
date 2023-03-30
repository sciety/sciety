import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { card1, card2, card3 } from './hardcoded-user-list-cards';
import { renderCardsSection } from './render-cards-section';
import { Ports, userListCard } from './user-list-card';
import { HtmlFragment } from '../../../types/html-fragment';

export const cards = (ports: Ports): HtmlFragment => pipe(
  {
    first: pipe(
      {
        userId: card1.userId,
        listId: card1.listId,
      },
      sequenceS(O.Apply),
      O.chain(userListCard(ports)),
    ),
    second: pipe(
      {
        userId: card2.userId,
        listId: card2.listId,
      },
      sequenceS(O.Apply),
      O.chain(userListCard(ports)),
    ),
    third: pipe(
      {
        userId: card3.userId,
        listId: card3.listId,
      },
      sequenceS(O.Apply),
      O.chain(userListCard(ports)),
    ),
  },
  sequenceS(O.Apply),
  renderCardsSection,
);
