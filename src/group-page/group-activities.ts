import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { constant, flow, pipe } from 'fp-ts/function';
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

type AllGroupActivities = (events: ReadonlyArray<DomainEvent>) => ReadonlyMap<Doi, {
  latestActivityDate: Date,
  evaluationCount: number,
}>;

const allGroupActivities: AllGroupActivities = flow(
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(
    RM.empty,
    (activities: ReadonlyMap<Doi, { latestActivityDate: Date, evaluationCount: number }>, event) => pipe(
      activities,
      RM.lookup(eqDoi)(event.articleId),
      O.fold(
        () => ({ latestActivityDate: event.date, evaluationCount: 1 }),
        (oldActivity) => ({
          latestActivityDate: event.date,
          evaluationCount: oldActivity.evaluationCount + 1,
        }),
      ),
      (newActivity) => RM.upsertAt(eqDoi)(event.articleId, newActivity)(activities),
    ),
  ),
);

type Activity = { groupId: GroupId, articleId: Doi };

const dois = (events: ReadonlyArray<DomainEvent>, groupId: GroupId): ReadonlyArray<Doi> => pipe(
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
);

const join = (dois: ReadonlyArray<Doi>, activities: ReadonlyMap<Doi, { latestActivityDate: Date, evaluationCount: number}>) => pipe(
  dois,
  RA.map((doi) => pipe(
    activities,
    RM.lookup(eqDoi)(doi),
    O.map((activityDetails) => ({ ...activityDetails, doi })),
  )),
);

export const groupActivities: GroupActivities = (events) => (groupId) => pipe(
  I.Do,
  I.bind('dois', () => dois(events, groupId)),
  I.bind('activities', () => pipe(events, allGroupActivities)),
  ({ activities, dois }) => join(dois, activities),
  RA.reverse,
  O.sequenceArray,
);
