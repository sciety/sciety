import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { card1, card2, card3 } from './hardcoded-user-list-cards';
import { renderCardsSection } from './render-cards-section';
import { Ports, userListCard } from './user-list-card';
import { HtmlFragment } from '../../../types/html-fragment';

export const cards = (ports: Ports): HtmlFragment => pipe(
  {
    first: userListCard(ports)(
      card1.id,
      card1.description,
    ),
    second: userListCard(ports)(
      card2.id,
      card2.description,
    ),
    third: userListCard(ports)(
      card3.id,
      card3.description,
    ),
  },
  sequenceS(O.Apply),
  renderCardsSection,
);
