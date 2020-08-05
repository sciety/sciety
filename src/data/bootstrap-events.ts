import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

const events: NonEmptyArray<Event> = [
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'),
    articleId: new Doi('10.1101/2020.01.22.915660'),
  },
  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-09'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
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
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
    articleId: new Doi('10.1101/751099'),
  },
  {
    type: 'ArticleReviewed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.14.095547'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Thu Jun 25 10:06:23 2020 +0100'),
    actorId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'), // Review Commons
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Tue Jun 16 17:42:28 2020 +0100'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'), // A PREreview Journal Club
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Wed May 13 13:14:49 2020 +0100'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'), // eLife
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Wed May 20 15:45:41 2020 +0100'),
    actorId: new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd7'), // PREReview
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Wed May 27 13:36:51 2020 +0100'),
    actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), // PeerJ
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date('Tues August 4 14:38:51 2020 +0100'),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'), // PCI Zoology
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
  {
    type: 'ArticleReviewed', date: new Date('2017-05-06'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/069484'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2017-06-21'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/152397'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2017-09-14'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/188425'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-02-23'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/084673'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-02-08'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/209320'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-03-14'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/259150'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-01-04'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/221861'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2017-08-18'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/177253'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-02-15'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/437293'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-01-16'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/226092'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-05-04'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/312330'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-07-08'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/313015'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-06-22'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/351486'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2018-09-22'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/186825'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2019-08-09'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/416677'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2019-08-16'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/718031'),
  },
  {
    type: 'ArticleReviewed', date: new Date('2019-10-09'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/751099'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2017-05-06'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/069484'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2017-06-21'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/152397'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2017-09-14'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/188425'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-02-23'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/084673'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-02-08'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/209320'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-03-14'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/259150'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-01-04'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/221861'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2017-08-18'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/177253'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-02-15'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/437293'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-01-16'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/226092'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-05-04'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/312330'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-07-08'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/313015'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-06-22'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/351486'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2018-09-22'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/186825'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2019-08-09'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/416677'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2019-08-16'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/718031'),
  },
  {
    type: 'ArticleEndorsed', date: new Date('2019-10-09'), actorId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), articleId: new Doi('10.1101/751099'),
  },
];

export default events;
