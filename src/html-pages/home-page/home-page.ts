import { pipe } from 'fp-ts/function';
import { cards, Ports as CardsPorts } from './cards';
import { Page } from '../../types/page';
import { groups } from './groups';
import { renderHomepage } from './render-home-page';

type Ports = CardsPorts;

export const homePage = (ports: Ports): Page => pipe(
  {
    groups,
    cards: cards(ports),
  },
  renderHomepage,
  (content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  }),
);
