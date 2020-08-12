import Doi from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { NonEmptyArray } from '../types/non-empty-array';

const events: NonEmptyArray<DomainEvent> = [
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
    articleId: new Doi('10.1101/2020.01.22.915660'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
    articleId: new Doi('10.1101/2019.12.13.875419'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-22'),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    articleId: new Doi('10.1101/2019.12.20.884908'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-01'),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    articleId: new Doi('10.1101/653980'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-01-10'),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
    articleId: new Doi('10.1101/722579'),
  },
];

export default events;
