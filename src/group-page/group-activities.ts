import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { constant, flow, pipe } from 'fp-ts/function';
import { Doi, eqDoi } from '../types/doi';
import {
  DomainEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

type GroupActivities = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => (
  O.Option<ReadonlyArray<ArticleActivity>>
);

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

export const groupActivities: GroupActivities = (events) => (groupId) => pipe(
  I.Do,
  I.bind('dois', () => pipe(
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
    RA.reverse,
    RA.uniq(eqDoi),
  )),
  I.bind('activities', () => pipe(events, allGroupActivities)),
  ({ activities, dois }) => pipe(
    dois,
    RA.map((doi) => pipe(
      activities,
      RM.lookup(eqDoi)(doi),
      O.map((activityDetails) => ({ ...activityDetails, doi })),
    )),
  ),
  O.sequenceArray,
);
