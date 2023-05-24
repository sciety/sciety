import { card1, card2, card3 } from './hardcoded-evaluation-cards';
import { templateDate } from '../../../shared-components/date';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

type Card = {
  articleId: string,
  articleTitle: string,
  date: Date,
  groupSlug: string,
  groupName: string, // TODO: derive from the groupSlug via the groups readmodel
  avatarPath: string, // TODO: derive from the groupSlug via the groups readmodel
};

const renderEvaluationCard = (card: Card) => `
  <article class="evaluation-card">
    <h3 class="evaluation-card__title">
      <a class="evaluation-card__link" href="/articles/activity/${card.articleId}">${card.articleTitle}</a>
    </h3>
    <p class="evaluation-card__group">
      <img class="evaluation-card__avatar" src="${card.avatarPath}" alt="" />
      <span>Evaluated by <a href="/groups/${card.groupSlug}">${card.groupName}</a></span>
    </p>
    <div class="evaluation-card__meta">
      ${templateDate(card.date)}
    </div>
  </article>
`;

const evaluationCards = (c1: Card, c2: Card, c3: Card) => toHtmlFragment(`
  <h2 class="home-page-cards__title">Most recent evaluations</h2>
  <ul class="home-page-cards__cards">
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

export const renderEvaluationCardsSection = (): HtmlFragment => toHtmlFragment(`
  <section class="home-page-cards">
    ${evaluationCards(card1, card2, card3)}
  </section>
`);
