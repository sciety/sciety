import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { constant, pipe } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import {
  DomainEvent,
  editorialCommunityReviewedArticle,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';

import { eqGroupId, GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

type GroupActivities = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => (
  O.Option<ReadonlyArray<ArticleActivity>>
);

export const hardCodedEvents: ReadonlyArray<DomainEvent> = [
  editorialCommunityReviewedArticle(
    new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    new Doi('10.1101/661249'),
    new Doi('10.24072/pci.animsci.100001'),
    new Date('2019-09-06T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    new Doi('10.1101/760082'),
    new Doi('10.24072/pci.animsci.100002'),
    new Date('2019-12-05T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    new Doi('10.1101/2019.12.20.884056'),
    new Doi('10.24072/pci.animsci.100004'),
    new Date('2020-10-14T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('4eebcec9-a4bb-44e1-bde3-2ae11e65daaa'),
    new Doi('10.1101/2020.09.15.286153'),
    new Doi('10.24072/pci.animsci.100005'),
    new Date('2020-12-15T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
    new Doi('10.1101/2019.12.20.884056'),
    new Doi('10.7287/peerj.11014v0.1/reviews/1'),
    new Date('2021-03-10T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
    new Doi('10.1101/2019.12.20.884056'),
    new Doi('10.7287/peerj.11014v0.1/reviews/2'),
    new Date('2021-03-10T00:00:00.000Z'),
  ),
  editorialCommunityReviewedArticle(
    new GroupId('53ed5364-a016-11ea-bb37-0242ac130002'),
    new Doi('10.1101/2019.12.20.884056'),
    new Doi('10.7287/peerj.11014v0.2/reviews/2'),
    new Date('2021-03-10T00:00:00.000Z'),
  ),
];

const allGroupActivities: ReadonlyMap<Doi, {
  latestActivityDate: Date,
  evaluationCount: number,
}> = new Map([[
  new Doi('10.1101/2020.09.15.286153'),
  {
    latestActivityDate: new Date('2020-12-15'),
    evaluationCount: 1,
  },
],
[
  new Doi('10.1101/2019.12.20.884056'),
  {
    latestActivityDate: new Date('2021-03-10'),
    evaluationCount: 4,
  },
],
[
  new Doi('10.1101/760082'),
  {
    latestActivityDate: new Date('2019-12-05'),
    evaluationCount: 1,
  },
],
[
  new Doi('10.1101/661249'),
  {
    latestActivityDate: new Date('2019-09-06'),
    evaluationCount: 1,
  },
]]);

type Activity = { groupId: GroupId, articleId: Doi };

export const groupActivities: GroupActivities = (events) => (groupId) => pipe(
  events,
  RA.reduce(RA.empty, (state: ReadonlyArray<Activity>, event) => pipe(
    event,
    O.fromPredicate(isEditorialCommunityReviewedArticleEvent),
    O.fold(
      constant(state),
      ({ editorialCommunityId, articleId }) => RA.fromArray([...state, { groupId: editorialCommunityId, articleId }]),
    ),
  )),
  RA.filter((activity) => eqGroupId.equals(activity.groupId, groupId)),
  RA.map((activity) => activity.articleId),
  RA.map((doi) => pipe(
    allGroupActivities,
    RM.lookup(eqDoi)(doi),
    O.map((activityDetails) => ({ ...activityDetails, doi })),
  )),
  RA.reverse,
  O.sequenceArray,
);
