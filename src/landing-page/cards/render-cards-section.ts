import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { card1, card2, card3 } from './hardcoded-evaluation-cards';
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

const renderEvaluationCard = (card: Card) => `
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
        <h2 class="landing-page-cards__title">Most actively curated lists</h2>
        <p class="landing-page-cards__explanatory_text">
          Featured lists curated by users.
          Log in to save articles to your own list.
        </p>
        <ul class="landing-page-cards__cards">
          <li>
            ${cards.first}
          </li>
          <li>
            ${cards.second}
          </li>
          <li>
            ${cards.third}
          </li>
        </ul>
      `,
  ),
  toHtmlFragment,
);

const evaluationCards = (c1: Card, c2: Card, c3: Card) => toHtmlFragment(`
  <h2 class="landing-page-cards__title">Recent group evaluations</h2>
  <p class="landing-page-cards__explanatory_text">
    Highlighted evaluations by selected groups of discipline experts.
    <a href="/groups">View all groups</a>.
  </p>
  <ul class="landing-page-cards__cards">
    <li>
      ${renderEvaluationCard(c1)}
    </li>
    <li>
      ${renderEvaluationCard(c2)}
    </li>
    <li>
      ${renderEvaluationCard(c3)}
    </li>
  </ul>
`);

export const renderCardsSection = (userLists: E.Either<DE.DataError, Record<string, HtmlFragment>>): HtmlFragment => toHtmlFragment(`
  <section class="landing-page-cards">
    ${userListCards(userLists)}
    ${evaluationCards(card1, card2, card3)}
    <div class="landing-page-cards__call_to_action">
      <a href="/groups" class="landing-page-cards__button">Discover more groups</a>
    </div>
  </section>
`);
