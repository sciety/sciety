import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { cards, Ports as CardsPorts } from './cards';
import { hero } from './hero';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { userCodec } from '../../types/user';

export const homePageParams = t.type({
  user: tt.optionFromNullable(userCodec),
});

type Components = {
  hero: HtmlFragment,
  cards: HtmlFragment,
};

type Ports = CardsPorts;

const renderContent = (components: Components) => toHtmlFragment(`
  <div class="home-page">
    ${components.hero}
    ${components.cards}
  </div>
`);

export const homePage = (ports: Ports): T.Task<Page> => pipe(
  {
    hero: T.of(hero),
    cards: T.of(cards(ports)),
  },
  sequenceS(T.ApplyPar),
  T.map(renderContent),
  T.map((content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  })),
);
