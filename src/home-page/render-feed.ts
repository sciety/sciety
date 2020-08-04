import createRenderFeedItem, { Event, GetActor, GetArticle } from './render-feed-item';
import templateListItems from '../templates/list-items';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';

type RenderFeed = () => Promise<string>;

const events: Array<Event> = [
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
    articleId: new Doi('10.1101/2020.01.22.915660'),
    articleTitle: 'Functional assessment of cell entry and receptor usage for lineage B β-coronaviruses, including 2019-nCoV',
  },
  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
    articleTitle: 'Diffusion tubes: a method for the mass culture of ctenophores and other pelagic marine invertebrates',
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    articleId: new Doi('10.1101/2019.12.13.875419'),
    articleTitle: 'Unconventional kinetochore kinases KKT2 and KKT3 have a unique zinc finger that promotes their kinetochore localization',
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
    articleTitle: 'GATA-1-dependent histone H3K27ac mediates erythroid cell-specific interaction between CTCF sites',
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
    articleTitle: 'Diffusion tubes: a method for the mass culture of ctenophores and other pelagic marine invertebrates',
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
    articleTitle: 'GATA-1-dependent histone H3K27ac mediates erythroid cell-specific interaction between CTCF sites',
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('2020-06-18'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('2020-06-14'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
  },
];

export { GetActor, GetArticle } from './render-feed-item';

export default (
  getActor: GetActor,
  getArticle: GetArticle,
): RenderFeed => {
  const renderFeedItem = createRenderFeedItem(getActor, getArticle);
  return async () => {
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  };
};
