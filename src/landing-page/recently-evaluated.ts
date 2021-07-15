import { templateDate } from '../shared-components/date';
import { toHtmlFragment } from '../types/html-fragment';

type Card = {
  articleId: string,
  articleTitle: string,
  date: Date,
  groupId: string,
  groupName: string,
  avatarPath: string,
};

const card1: Card = {
  articleId: '10.1101/2021.05.20.21257512',
  articleTitle: 'Anti-Sars-Cov-2 IgA And IgG In Human Milk After Vaccination Is Dependent On Vaccine Type And Previous Sars-Cov-2 Exposure: A Longitudinal Study',
  date: new Date('2021-07-09'),
  groupId: '62f9b0d0-8d43-4766-a52a-ce02af61bc6a',
  groupName: 'NCRC',
  avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
};

const card2: Card = {
  articleId: '10.1101/2021.05.02.442186',
  articleTitle: 'Embryonic hyperglycemia perturbs the development of specific retinal cell types, including photoreceptors',
  date: new Date('2021-07-09'),
  groupId: '316db7d9-88cc-4c26-b386-f067e0f56334',
  groupName: 'Review Commons',
  avatarPath: '/static/groups/review-commons--316db7d9-88cc-4c26-b386-f067e0f56334.jpg',
};

const card3: Card = {
  articleId: '10.1101/2021.01.07.425654',
  articleTitle: 'Gpr161 ciliary pools prevent hedgehog pathway hyperactivation phenotypes specifically from lack of Gli transcriptional repression',
  date: new Date('2021-07-13'),
  groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
  groupName: 'eLife',
  avatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
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

export const recentlyEvaluated = toHtmlFragment(`
  <section class="landing-page-recently-evaluated">
    <h2 class="landing-page-recently-evaluated__title">Recently evaluated by groups on Sciety</h2>
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
