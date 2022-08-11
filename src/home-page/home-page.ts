import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { cards, Ports as CardsPorts } from './cards';
import { hero } from './hero';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const homePageParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
    handle: t.string,
    avatarUrl: t.string,
  })),
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
    cards: cards(ports),
  },
  sequenceS(T.ApplyPar),
  T.map(renderContent),
  T.map((content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  })),
);
