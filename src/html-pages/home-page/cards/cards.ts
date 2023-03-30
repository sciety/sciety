import { sequenceS } from 'fp-ts/Apply';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { renderCardsSection } from './render-cards-section';
import { Ports, userListCard } from './user-list-card';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId, listIdCodec } from '../../../types/list-id';

type Card = {
  listId: O.Option<ListId>,
};

const card1: Card = {
  listId: pipe(
    '454ba80f-e0bc-47ed-ba76-c8f872c303d2', // Biophysics Colab reading list
    listIdCodec.decode,
    O.fromEither,
  ),
};

const card2: Card = {
  listId: pipe(
    'dcc7c864-6630-40e7-8eeb-9fb6f012e92b', // @AvasthiReading's saved articles
    listIdCodec.decode,
    O.fromEither,
  ),
};

const card3: Card = {
  listId: pipe(
    '154c0659-5310-4dcc-9da3-1de24d99a542', // @LSE_Angela's List of Preprints to Read
    listIdCodec.decode,
    O.fromEither,
  ),
};

export const cards = (ports: Ports): HtmlFragment => pipe(
  {
    first: pipe(
      card1.listId,
      O.chain(userListCard(ports)),
    ),
    second: pipe(
      card2.listId,
      O.chain(userListCard(ports)),
    ),
    third: pipe(
      card3.listId,
      O.chain(userListCard(ports)),
    ),
  },
  sequenceS(O.Apply),
  renderCardsSection,
);
