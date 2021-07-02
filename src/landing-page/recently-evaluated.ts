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
  articleId: '10.1101/2021.01.20.427368',
  articleTitle: 'GRP78 binds SARS-CoV-2 Spike protein and ACE2 and GRP78 depleting antibody blocks viral entry and infection in vitro',
  date: new Date('2021-06-17'),
  groupId: '5142a5bc-6b18-42b1-9a8d-7342d7d17e94',
  groupName: 'RR:C19',
  avatarPath: '/static/groups/rapid-reviews-covid-19--5142a5bc-6b18-42b1-9a8d-7342d7d17e94.png',
};

const card2: Card = {
  articleId: '10.1101/2020.12.21.423144',
  articleTitle: 'Oligomerization of the Human Adenosine A 2A Receptor is Driven by the Intrinsically Disordered C-terminus',
  date: new Date('2021-06-29'),
  groupId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
  groupName: 'eLife',
  avatarPath: '/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
};

const card3: Card = {
  articleId: '10.1101/2021.06.02.21258076',
  articleTitle: 'Genomic characterization and Epidemiology of an emerging SARS-CoV-2 variant in Delhi, India',
  date: new Date('2021-06-18'),
  groupId: '62f9b0d0-8d43-4766-a52a-ce02af61bc6a',
  groupName: 'NCRC',
  avatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
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
