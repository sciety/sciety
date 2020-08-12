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
    type: 'ArticleEndorsed',
    date: new Date('2014-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/001602'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/001701'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/002741'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/003277'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/005041'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/007203'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-08-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/007310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/004762'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/006270'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-10-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/006312'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-12-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/009373'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/008607'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/005066'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/007807'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/008128'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/008490'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2014-12-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/005140'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/009175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-04-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/011031'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-04-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/008938'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/016451'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/018408'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/007237'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-08-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/016931'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-09-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/021998'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-09-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/016733'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-10-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/018317'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/008532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/023887'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-10-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/023770'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-12-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/025890'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/020883'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/026799'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-12-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/027896'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-12-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/027458'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-01-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/035188'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/025247'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/017152'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/024364'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/021535'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/037143'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/027375'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/036509'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/028308'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/026617'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/041780'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-04-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/032540'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/025452'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-03-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/046367'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/045781'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/038372'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/037721'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/038281'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/029397'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/044974'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-05-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/031617'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-06-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/038406'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/045096'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-07-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/034736'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/055210'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-06-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/055947'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-07-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/063289'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/063495'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/052936'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-08-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/040238'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/033613'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/028522'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/050286'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/070623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066118'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-09-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/056267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/052431'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/052241'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/070086'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/062257'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/075036'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/044990'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/065789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/073049'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/065235'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066464'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064519'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064592'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/053983'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/059717'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/065722'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/067785'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/055939'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/087858'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064881'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064949'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/073908'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/043075'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/067744'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/068742'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066373'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/087403'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/045963'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/036335'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/080010'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/071613'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/036822'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/037374'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/072702'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066035'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/094649'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/077354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/070375'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/071076'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/097188'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/085530'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/076703'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/099184'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064832'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/074641'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/095752'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/059899'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/057729'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/072413'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/077966'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/041103'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/081349'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/038059'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/091256'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/036442'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/112847'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2016-12-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/039511'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/096909'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/089581'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/114926'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066522'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/106930'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/105866'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/125716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/082958'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121855'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/071910'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/106567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/084343'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/074872'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/096248'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/099051'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/093476'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/101154'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/087668'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/067421'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/067025'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/110072'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/066217'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/108035'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/110544'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/102319'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/103028'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/097659'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/091827'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/093096'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/101964'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/082602'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126086'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/115907'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/144303'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/079137'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/061739'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/114496'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/114504'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/110841'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/130054'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131995'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121780'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/099994'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/083493'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/084459'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/069005'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/107086'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/107094'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/118661'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/129908'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131987'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/153163'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/155309'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/120725'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/093815'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/104562'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143883'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141788'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143743'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/110197'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/134007'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/130831'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/120980'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121749'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/122887'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/125104'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126631'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/100479'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/078162'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/151399'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124867'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/108910'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/083626'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/086447'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/116285'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/068692'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126466'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/138925'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143347'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/147975'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/148080'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/139824'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/139956'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/140053'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141820'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124370'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/133348'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/129411'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/130096'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131425'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/119370'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/123026'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/120857'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121111'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/109918'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/083691'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/101972'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/155994'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/105569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/170811'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/136572'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156844'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/091272'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/149955'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/154864'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/087619'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/139535'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141507'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/142489'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/119404'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/146837'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/146753'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/149641'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/150250'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/142265'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/140277'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/132936'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/127159'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121590'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/122580'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124594'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/125765'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/125831'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/086363'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/089854'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141952'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/133686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/136754'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/037838'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/164301'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/167718'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/170290'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/179077'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/120519'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/144568'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143727'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/128280'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/095927'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/033266'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/107631'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/117788'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/149344'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/164368'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/176388'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/135343'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/145789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156877'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166256'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/171538'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/144295'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166462'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/128710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/154963'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/168336'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/175836'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/193847'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/115204'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126771'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/137778'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/153098'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/159822'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/170522'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/178210'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189563'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/193557'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199661'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/203950'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/212274'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/099515'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156596'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/153445'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/152223'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/127704'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126755'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/137372'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/137265'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/138891'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/144139'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156893'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/181503'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/191577'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199034'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/151910'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/157263'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/147587'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/159376'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/171983'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189258'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/200360'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/116657'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174078'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/173211'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/186338'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/060988'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/192898'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/194175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141911'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/148213'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/171058'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174466'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/176354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/180984'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/182444'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/183921'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/122903'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/172288'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174185'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/183137'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/187310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/190892'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/229716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/146498'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/159889'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/192278'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199679'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/205187'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/207514'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/221200'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/240119'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/167262'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141879'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/157818'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/173245'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/193995'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/200428'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/203331'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/205260'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/210195'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/258087'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/168476'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/180703'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/222653'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/173567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/182808'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/190546'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/197764'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/224022'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/231399'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/257618'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/126201'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/176198'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/181784'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/183327'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/195057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/212902'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/229492'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/250753'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/181487'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/163352'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/177881'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/225722'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/236778'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/282657'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/214536'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/220731'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/229047'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/235630'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/235762'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245589'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245886'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/253054'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/119867'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/163790'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/218263'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/235978'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/118786'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174151'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/205906'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/221218'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/222166'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/237818'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/112623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/196006'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/205377'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/216333'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245191'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/271106'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/067843'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/200352'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/204354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/208900'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/213405'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/236901'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/241083'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/250100'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251629'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252940'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189456'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131318'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/210815'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/264887'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/267674'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/280503'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/223149'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/288837'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/315531'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/203984'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198291'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245522'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245209'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/261594'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/263137'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198572'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/203505'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/111807'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/168559'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198507'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/235333'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/087502'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/173328'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/208686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/214056'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/216317'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/216838'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/226217'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/230276'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/230615'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/241943'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/247668'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/247726'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/286856'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/287102'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/211789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198408'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/217679'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/242594'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251124'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/284984'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316323'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/123851'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/212381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/243485'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/255745'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/255802'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/274860'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/311506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/202374'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/219022'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/224758'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/233718'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/246744'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/294538'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/350421'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/250902'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/208975'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/244533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199836'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/213074'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/217422'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/226803'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/230128'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/231696'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/233577'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/249417'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/257451'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/268409'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/273755'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/273912'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/276436'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/277335'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/281774'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/291336'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/317339'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/196279'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/286955'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/287367'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/340869'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/277202'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/237479'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/264549'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/268458'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/293233'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/296699'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/308957'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/312314'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/128769'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/186924'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189407'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/191197'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198317'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/208447'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/235267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/242057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/274464'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/276212'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/311431'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316679'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/327072'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/142455'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/132506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/107995'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/113753'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/123935'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/130120'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/130716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/138701'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/140210'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/151365'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/151738'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/153684'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/157412'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/163394'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/164715'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166512'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/168948'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/171827'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/207530'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/232140'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/246116'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/259424'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/263954'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/287151'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/290874'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/322289'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/317651'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/331165'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/337337'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-02-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/010165'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/014589'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2015-11-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/016329'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/184432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/261578'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/272591'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/286724'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/303719'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316307'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/319772'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/323584'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/331223'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/340802'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/381897'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/070672'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-01-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/082370'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/085548'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/092403'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/097493'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/102525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/111781'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/116681'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/118364'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/120444'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/121913'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/122986'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/123133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124008'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/124669'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/128595'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-08-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/131110'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/132381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/133546'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/135418'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/142992'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/143826'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/145078'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/148270'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/148692'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/114991'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/189035'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245316'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/294603'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/296525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/307660'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/271023'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/254326'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/147959'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/150730'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/152918'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156307'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/156950'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/157032'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/105015'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/245373'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/284034'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/313106'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/348243'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/161133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/214775'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/246215'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/250332'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252148'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/259846'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/296350'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/309732'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/320473'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/393603'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/163642'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/164756'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/165738'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166561'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/200774'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/290353'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/292607'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/301234'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316364'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/168716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166819'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/246256'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/297424'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/297895'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/300251'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/330654'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/389098'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/218149'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/216150'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/224337'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/282376'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/292706'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/336016'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/343483'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/397992'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/413658'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/172593'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/172908'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174631'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/176362'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/180133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/180729'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/233338'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/238048'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/306647'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/324194'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/346650'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353078'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/359166'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/217604'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/194951'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199562'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/242651'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252189'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/317107'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/320135'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/326942'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/330324'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/333948'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/352419'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/381921'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/203638'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/204057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/204784'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/209163'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/229534'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/215368'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/215814'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/125419'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/212696'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/237586'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251694'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/253872'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/264101'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/299644'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/301853'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/322057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/355651'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/367805'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/376202'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/218966'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/219923'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/174367'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/207696'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/219956'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/250928'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/260455'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353490'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/360107'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/244434'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/312488'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/199497'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/236364'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2017-12-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/227546'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/334599'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/337964'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/347427'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353524'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/350819'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/385039'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/408732'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/408716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/230003'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/200972'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/283150'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/318675'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/344135'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/372748'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/380774'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/391342'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/397000'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/421123'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/470419'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/350413'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/236562'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/238097'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/238352'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/240549'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/166413'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/274191'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/306472'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/311381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/320499'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/328385'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/341560'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/366344'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/366500'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/395830'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/396671'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/422725'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/455634'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/462432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/242958'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/242552'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/147223'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/180414'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/253740'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/295105'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/325597'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/344937'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/363432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/376186'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/394924'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/427831'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/207282'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/213710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/222281'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/255570'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/222448'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/266882'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316539'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/325043'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/354969'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/368878'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/381160'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/389650'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/391789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/413724'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/420133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/243634'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/216499'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252817'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/296343'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/313536'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/321786'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/326165'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/335489'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/346718'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/372284'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/380972'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/384859'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/387555'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/234757'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/248310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252387'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/253096'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/202150'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/293886'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/331983'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/332916'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/335711'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/374405'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/377812'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/384800'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/388132'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/398362'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/405308'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/404772'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/416735'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/422220'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/428995'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/441923'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/505669'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/323741'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/313171'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/319806'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/410837'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/429746'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/432682'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/186528'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/266551'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/277368'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/319582'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/339564'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/358424'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/371427'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/384396'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/384685'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/402404'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/417790'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/433755'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/443689'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/455402'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/465781'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/381319'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/218354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/277095'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/397653'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403790'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/410308'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/411876'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/443697'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/483537'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/490920'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/266163'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/339556'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/273128'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/315804'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/347567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/362509'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/367797'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/373357'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/376368'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/382432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/383927'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/385278'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403014'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/410332'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/413880'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/421040'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/428532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/431882'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/438267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/446179'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/447920'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/183301'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/279158'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/229989'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/392654'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403766'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/432112'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/440818'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/444075'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/463968'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/467530'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/476911'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/485185'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/213686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/303503'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/342337'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/394460'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/408450'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/410944'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/411264'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/442590'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/464024'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/481820'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/507194'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/252841'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/324608'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/381376'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/402206'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/442459'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/455261'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/455287'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/462648'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/476705'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/504373'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/064956'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/248104'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/255547'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/275420'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/319749'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/369306'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/380527'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/388363'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/388918'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/425587'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/477612'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/493817'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/502344'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/561175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/351312'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/366757'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/406520'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/467910'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/482737'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/507723'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/417907'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/518944'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/376053'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/496729'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/452516'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/360743'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/456574'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/277251'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/278499'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/354951'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/431197'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/441469'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/462358'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/487579'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/425579'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/062380'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/499095'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/371484'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495887'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/545285'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/580845'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/281741'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/282384'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/284059'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-06-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/286310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/286153'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/289827'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/415190'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/424358'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/432740'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/437269'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/438721'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/443531'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/464412'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/477836'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495200'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/492165'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/526657'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/530659'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/537308'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/298448'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/299552'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/300525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/376228'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/420992'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/402552'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/447532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/451922'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/480202'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/447151'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/464867'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/465799'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/497222'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/501338'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/606889'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353136'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251348'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-08-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/301093'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/303800'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403782'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/454751'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/474312'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/514422'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/523266'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/584979'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/565226'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/433060'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/340026'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/400432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/382887'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/597351'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/294686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/398370'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/190298'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/461137'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/478297'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/363606'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/378521'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495150'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/363523'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/417873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/428565'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/470609'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/476333'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/474924'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/501528'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/501254'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/504555'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/515643'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/546424'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/547224'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/389346'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/241554'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/382895'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/379271'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/351957'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/355057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/498873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/485995'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/520502'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/500579'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/411272'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/330050'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/438994'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/485235'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/494310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512467'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/617852'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/533919'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/538363'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/529404'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/545293'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/412932'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/566489'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/484139'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/525782'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/459602'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403253'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/441592'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/461533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/336982'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/412718'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/258970'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/509844'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/409672'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/516088'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/458570'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/515221'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512665'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/457077'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/383018'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/451930'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/527341'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/564690'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/526111'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/557520'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629295'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/477802'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/490698'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512947'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/545301'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/307264'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512954'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/392381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/446922'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/530287'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/413211'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/378711'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/520056'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/356436'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/578617'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/517649'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495085'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/481960'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/461558'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/537860'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/628149'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/370650'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/559492'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/378414'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495952'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/598029'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/560425'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/588830'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/403394'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/379735'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/458810'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/436592'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/444570'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/375071'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/492157'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/614727'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/611343'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/671099'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/563064'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/408708'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/643353'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/485110'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/486043'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/545582'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/385393'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/351569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/393769'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/432864'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/395863'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/440388'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/382440'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/432153'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/573626'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/389460'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/446088'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/547919'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/650168'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/527846'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/378133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/578716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/590786'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/459750'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/555441'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/475103'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/550053'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/306779'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/498220'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/310599'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/551812'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/536599'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/251595'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/588681'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/534990'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/322586'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/523589'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/313494'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/387266'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/420174'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/437947'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/452144'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/471490'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/473967'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/510032'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/518555'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/515569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/526137'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/553206'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/553610'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/558759'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/561456'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/563304'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/566927'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/575175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/584961'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/553198'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/344267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/527119'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/631358'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/586487'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/645960'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/562892'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/309476'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/615906'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/589135'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/641662'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/705418'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/635383'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/641506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/371203'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/568139'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/638015'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/667600'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/338087'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/604330'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/458133'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/570929'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/560326'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/573212'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/490011'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/568501'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/601922'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/602433'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/304600'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/571455'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/647883'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/405183'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/604264'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/445262'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/323501'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/438648'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/447276'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/665190'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/615682'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/573923'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316299'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/531525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/689687'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/631408'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/522920'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/595710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/640789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/581744'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/608851'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/467076'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/584698'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/612069'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/595686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/298422'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/642017'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/670497'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/466730'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/509380'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/564401'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/597567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/600494'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/518654'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/552158'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/600551'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/594184'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/587964'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/618009'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629618'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/636092'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/555664'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/694976'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/578997'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/653782'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/643197'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/591685'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/423681'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/624056'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/621185'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/570820'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/653030'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/569095'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/559831'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/637702'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/701532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/683631'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/555508'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/442483'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/600445'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/572602'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/581611'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/569608'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/364166'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/733527'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/529016'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/595025'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/631861'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/683623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/497321'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/600841'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629675'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/611152'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/469494'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/198663'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/535468'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/360255'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/339457'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/596221'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/571935'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/649566'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495234'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/211748'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/658468'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/621474'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/587386'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/623058'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/665851'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/729418'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/521880'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/686758'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629725'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/620245'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/750646'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/678987'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/349381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/578526'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/552240'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/583989'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/651810'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/320184'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/625228'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/662700'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/624700'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735746'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/582296'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/436360'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/563619'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/636241'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512590'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/673756'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/708537'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/642314'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/738682'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/760801'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/639146'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/592006'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/170787'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/631341'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/669572'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/661199'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/644880'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/695643'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/653873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/648824'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/723619'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/541151'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/538538'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/514943'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/746289'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/665992'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/734590'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/279588'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/353508'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/496323'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/473769'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/468892'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/462820'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/289009'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/426130'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/402883'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/576736'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/398925'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/338582'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/334813'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-09-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/334607'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/325449'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/316414'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/295972'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/272963'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-04-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/255737'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2018-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/197145'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/170639'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/499350'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/609917'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/720094'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/736272'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/279505'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/591164'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/570663'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/533653'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/296616'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/440396'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/579771'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/711176'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/617373'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/544080'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/410563'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/763789'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/713990'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/640375'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/738567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/724633'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/728733'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/699124'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/660035'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/421206'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/622266'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/669853'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735100'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/623447'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/768010'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/607291'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/770578'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/723908'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/583567'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/486050'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/518787'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/561811'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/565440'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/612440'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/653923'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/639328'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/697417'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/564161'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/673798'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/643924'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/546945'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/272914'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/632281'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/668715'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/675389'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/687574'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/564930'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/593590'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/673533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/519694'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/385658'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/726083'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/682815'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/722512'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/677799'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/141069'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/319517'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/399766'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/370130'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/666362'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/737635'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/755777'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/693002'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/693291'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/638031'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/655266'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/687921'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/633107'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/775718'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/616698'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/680090'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/716928'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/658435'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/698571'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/808873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/711333'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/675900'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/754879'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/675363'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/715912'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/592071'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/548677'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/670547'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/624205'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735738'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/598276'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/097626'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/380907'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/339119'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/505487'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/707174'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/582353'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/564310'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/752444'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/733543'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/738658'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/694661'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/726026'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/668244'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/607713'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/640011'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/766725'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/699652'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-09-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/556209'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/700211'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/721902'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/281089'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/617746'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/373498'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/647115'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/373787'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/781005'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/796623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/586867'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/698548'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/624148'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/780635'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/550921'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/664177'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/804534'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/748855'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/810960'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/662437'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/643320'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/637215'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/503409'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/538546'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/798272'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/729913'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/803999'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/852756'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/782961'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/745059'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/548933'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/780494'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/645440'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/545517'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/767699'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/760983'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/739078'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/841262'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/559849'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/689448'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/685909'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/754382'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/385476'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/849877'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/730028'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/774695'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/678797'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/688002'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-11-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/462184'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/158774'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/740597'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/715938'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/643205'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/798579'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/764621'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/592014'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/554907'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/665034'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/533794'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/713909'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/750174'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/760868'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/714063'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/581678'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/808105'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/795872'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/732024'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/724484'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/744722'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629121'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/758813'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/512632'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/765172'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/716324'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/846535'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/798322'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629949'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/584334'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/528331'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/696195'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/626457'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/412353'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/330241'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735134'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/685008'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/555375'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/846998'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/660340'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/456863'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.23.887372'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/746271'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.27.921320'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/623777'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/818674'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/748467'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/398107'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/579623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/725267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/636076'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/649913'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/761775'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/745984'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/714055'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/678565'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/779108'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/780999'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/866467'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/531780'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/498899'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/368811'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/686576'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/779058'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/763227'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/529248'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/656165'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/807297'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/686626'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/813188'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/766873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/769141'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/802892'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/453514'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/779710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/446096'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-10-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/563726'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/621516'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/495218'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/783647'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/866780'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/682740'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/578211'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/750349'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/546911'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/704999'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/719690'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/714634'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/824946'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/813584'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/823468'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/711671'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/770859'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/843649'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/700088'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/691501'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/839365'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/826826'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/629451'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/641514'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.01.888354'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/624528'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/703637'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/751958'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/822460'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/847533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/811430'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/713156'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/799742'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/848044'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/797514'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/737494'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/453787'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/148650'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/611806'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/848309'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/807222'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/802686'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-12-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/782136'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/524256'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/632109'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/650010'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/766691'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/772640'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/777615'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/852962'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/453928'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/809533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/771873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.13.904185'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/424929'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/569335'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.24.887679'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/373936'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/710145'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/834671'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/836155'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/813097'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/479089'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/661264'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/789305'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/866392'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.31.891697'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/752030'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/836536'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/480863'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/815340'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/584532'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/761569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/802082'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.19.911917'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/825349'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/865493'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/510560'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/816512'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/863761'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/805267'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/788711'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/818872'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/825752'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.01.020057'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/742908'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/834481'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/483644'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/638650'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/863134'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/811927'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.31.016170'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/526962'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/853366'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.14.904409'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/759001'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/857136'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/799684'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.26.889030'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/612234'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.20.913038'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/788638'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/790493'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/833046'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.13.947119'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.17.880229'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.20.913210'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.24.918169'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/768275'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.12.946046'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/861369'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/753954'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.06.891127'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/837880'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.28.924019'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.13.875724'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/654079'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.29.890566'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/839076'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/305334'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/843540'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/861609'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.24.963637'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/534073'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/093690'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/824219'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.05.927434'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/811562'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/364216'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/758318'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-04-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/500322'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/496422'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.11.944231'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.17.879445'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/836023'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.27.922450'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.25.007252'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/856120'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.20.884429'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.20.884999'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.08.899229'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.17.995480'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.26.009217'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.24.963868'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/550996'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/783837'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/645234'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/787473'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/801696'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/761502'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.20.957746'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/851618'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.10.942359'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.13.875443'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.04.025338'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/838771'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.21.052506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/781716'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.15.043307'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/802710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.09.983569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.16.877506'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/420109'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-05-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/447482'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.07.938175'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/821603'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.24.005702'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/646810'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/868448'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.11.940668'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/854091'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.16.878264'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.16.877605'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.22.915975'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.07.897876'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.22.915553'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.12.944629'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/716761'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/706176'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.01.971986'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.12.946533'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/683755'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.15.876748'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/792192'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.24.004465'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.18.948406'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/847392'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.02.974154'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/799361'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.29.069476'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/413286'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/862805'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2019-08-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/626259'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-01-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/763508'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-02-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/716407'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.10.941690'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/767467'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.13.875849'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.18.986869'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/784728'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.19.956706'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.19.998427'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.05.936120'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.27.064931'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.27.011015'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.17.880203'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.11.872051'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/868711'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/743260'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/837658'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.04.025742'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.10.937540'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.03.975540'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/736140'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.15.098574'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/653436'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.14.906024'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/763482'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/856336'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-11'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/810663'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.22.110585'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.24.888230'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.16.877613'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-16'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.22.915363'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.10.985689'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.15.908574'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-15'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/853010'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.26.009571'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.05.935775'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.13.947705'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/489658'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.14.928432'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.28.923375'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/686949'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.24.918623'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-19'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/735605'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/832998'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.20.885129'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.17.911016'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/851626'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/844449'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/440792'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/748186'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.04.933440'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.16.877381'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.11.988170'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/845966'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-25'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.23.000257'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/832212'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/856153'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/759142'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/656710'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-26'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.03.972547'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-04-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/155382'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-03-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/714337'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-12'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/821306'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-09'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.23.057026'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.04.977231'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.20.051276'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-02'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.18.993998'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/786525'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.26.966895'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.24.919126'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-18'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.14.949404'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/870493'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/854521'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.30.926535'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/837641'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/827592'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/793851'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.13.946640'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/794685'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-05-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/754499'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.09.984237'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-10'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.02.893008'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.24.918318'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/841759'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-13'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.29.014720'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/610014'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/676270'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-17'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.13.092882'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.18.101485'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/781294'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.08.982769'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.31.928697'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.10.941286'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.14.950022'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-20'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.19.103580'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.24.060491'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/712687'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-08'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.31.017632'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-21'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/695080'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.09.984054'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.19.999086'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.29.926105'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/776534'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.21.954305'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.25.006817'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.03.023341'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-24'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/544569'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/631101'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.21.914077'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.27.889006'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-28'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/625210'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.28.066217'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.17.910562'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-29'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.26.965269'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/734822'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-27'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/431114'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-14'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/796334'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-06-23'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/632208'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-30'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/765198'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-31'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.06.18.159392'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-07-22'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.29.068775'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/821678'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2019.12.11.872994'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.07.20.211409'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-03'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/532556'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/569038'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.16.909531'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.05.28.120592'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.14.992065'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.23.002873'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.20.047134'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.04.23.058362'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-05'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.30.015313'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-06'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.02.18.955070'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-04'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.01.29.923862'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/2020.03.08.982751'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/834366'),
  },

  {
    type: 'ArticleEndorsed',
    date: new Date('2020-08-07'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/414706'),
  },
  {
    type: 'ArticleEndorsed',
    date: new Date('2017-06-01'),
    actorId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
    articleId: new Doi('10.1101/053595'),
  },
];

export default events;
