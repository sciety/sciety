import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { templateDate } from '../../shared-components/date';
import * as DE from '../../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

type Card = {
  articleId: string,
  articleTitle: string,
  date: Date,
  groupId: string,
  groupName: string,
  avatarPath: string,
};

const card1: Card = {
  articleId: '10.1101/2021.08.02.21261504',
  articleTitle: 'SARS-CoV-2 antibody binding and neutralization in dried blood spot eluates and paired plasma',
  date: new Date('2021-08-06'),
  groupId: '8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65',
  groupName: 'ScreenIT',
  avatarPath: '/static/groups/screenit--8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65.jpg',
};

const card2: Card = {
  articleId: '10.1101/2021.04.12.439487',
  articleTitle: 'VHL ligand binding increases intracellular level of VHL',
  date: new Date('2021-05-27'),
  groupId: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
  groupName: 'PREreview',
  avatarPath: '/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg',
};

const card3: Card = {
  articleId: '10.1101/2021.03.13.435259',
  articleTitle: 'Host phenology can drive the evolution of intermediate virulence strategies in some obligate-killer parasites',
  date: new Date('2021-07-19'),
  groupId: '19b7464a-edbe-42e8-b7cc-04d1eb1f7332',
  groupName: 'Peer Community in Evolutionary Biology',
  avatarPath: '/static/groups/pci-evolutionary-biology--19b7464a-edbe-42e8-b7cc-04d1eb1f7332.jpg',
};

const renderCard = (card: Card) => `
  <article class="landing-page-card">
    <h3 class="landing-page-card__title">
      <a class="landing-page-card__link" href="/articles/activity/${card.articleId}">${card.articleTitle}</a>
    </h3>
    <p class="landing-page-card__group">
      <img class="landing-page-card__avatar" src="${card.avatarPath}" alt="" />
      <span>Evaluated by <a href="/groups/${card.groupId}">${card.groupName}</a></span>
    </p>
    <div class="landing-page-card__meta">
      ${templateDate(card.date)}
    </div>
  </article>
`;

const userListCards = (userLists: E.Either<DE.DataError, Record<string, HtmlFragment>>): HtmlFragment => pipe(
  userLists,
  E.fold(
    () => '',
    (cards) => `
        <h2 class="landing-page-recently-evaluated__title">Most actively curated lists</h2>
        <p class="landing-page-recently-evaluated__explanatory_text">
          Featured lists curated by users.
          Log in to save articles to your own list.
        </p>
        <ul class="landing-page-recently-evaluated__articles">
          <li>
            ${cards.kenton}
          </li>
          <li>
            ${cards.prachee}
          </li>
          <li>
            ${cards.marius}
          </li>
        </ul>
      `,
  ),
  toHtmlFragment,
);

export const renderCardsSection = (userLists: E.Either<DE.DataError, Record<string, HtmlFragment>>): HtmlFragment => toHtmlFragment(`
  <section class="landing-page-recently-evaluated">
    ${userListCards(userLists)}
    <h2 class="landing-page-recently-evaluated__title">Recent group evaluations</h2>
    <p class="landing-page-recently-evaluated__explanatory_text">
      Highlighted evaluations by selected groups of discipline experts.
      <a href="/groups">View all groups</a>.
    </p>
    <ul class="landing-page-recently-evaluated__articles">
      <li>
        ${renderCard(card1)}
      </li>
      <li>
        ${renderCard(card2)}
      </li>
      <li>
        ${renderCard(card3)}
      </li>
    </ul>
    <div class="landing-page-recently-evaluated__call_to_action">
      <a href="/groups" class="landing-page-recently-evaluated__button">Discover more groups</a>
    </div>
  </section>
`);
