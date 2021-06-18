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
  articleId: '10.1101/2021.04.06.21254882',
  articleTitle: 'Evidence for increased breakthrough rates of SARS-CoV-2 variants of concern in BNT162b2 mRNA vaccinated individuals',
  date: new Date('2021-04-22'),
  groupId: '62f9b0d0-8d43-4766-a52a-ce02af61bc6a',
  groupName: 'NCRC',
  avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
};

const card2: Card = {
  articleId: '10.1101/2020.07.04.187583',
  articleTitle: 'Gender, race and parenthood impact academic productivity during the COVID-19 pandemic: from survey to action',
  date: new Date('2020-09-28'),
  groupId: '10360d97-bf52-4aef-b2fa-2f60d319edd7',
  groupName: 'PREreview',
  avatarPath: '/static/groups/prereview-community--10360d97-bf52-4aef-b2fa-2f60d319edd7.jpg',
};

const card3: Card = {
  articleId: '10.1101/2021.04.30.442087',
  articleTitle: 'Diverse mechanisms for epigenetic imprinting in mammals',
  date: new Date('2021-06-18'),
  groupId: 'f97bd177-5cb6-4296-8573-078318755bf2',
  groupName: 'prelights',
  avatarPath: '/static/groups/prelights--f97bd177-5cb6-4296-8573-078318755bf2.jpg',
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
