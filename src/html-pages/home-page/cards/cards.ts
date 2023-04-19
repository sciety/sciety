import { sequenceS } from 'fp-ts/Apply';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { renderCardsSection } from './render-cards-section';
import { Ports, generateMostActiveListCard } from './generate-most-active-list-card';
import { HtmlFragment } from '../../../types/html-fragment';
import { listIdCodec } from '../../../types/list-id';

const card1 = '454ba80f-e0bc-47ed-ba76-c8f872c303d2'; // Biophysics Colab reading list
const card2 = 'dcc7c864-6630-40e7-8eeb-9fb6f012e92b'; // @AvasthiReading's saved articles
const card3 = '154c0659-5310-4dcc-9da3-1de24d99a542'; // @LSE_Angela's List of Preprints to Read

export const cards = (ports: Ports): HtmlFragment => pipe(
  {
    first: pipe(
      card1,
      listIdCodec.decode,
      E.getOrElseW((errors) => { throw new Error(JSON.stringify(errors)); }),
      generateMostActiveListCard(ports),
    ),
    second: pipe(
      card2,
      listIdCodec.decode,
      E.getOrElseW((errors) => { throw new Error(JSON.stringify(errors)); }),
      generateMostActiveListCard(ports),
    ),
    third: pipe(
      card3,
      listIdCodec.decode,
      E.getOrElseW((errors) => { throw new Error(JSON.stringify(errors)); }),
      generateMostActiveListCard(ports),
    ),
  },
  sequenceS(O.Apply),
  renderCardsSection,
);
