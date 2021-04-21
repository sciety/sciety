import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as S from 'fp-ts/Semigroup';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { Doi, eqDoi } from '../types/doi';
import {
  DomainEvent, EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

type GroupActivities = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => ReadonlyArray<ArticleActivity>;

type ActivityDetails = {
  latestActivityDate: Date,
  latestActivityByGroup: O.Option<Date>,
  evaluationCount: number,
};

const semigroupActivityDetails: S.Semigroup<ActivityDetails> = S.struct({
  latestActivityDate: S.max(D.Ord),
  latestActivityByGroup: O.getMonoid(S.max(D.Ord)),
  evaluationCount: N.SemigroupSum,
});

const eventToActivityDetails = (
  event: EditorialCommunityReviewedArticleEvent,
  groupId: GroupId,
): ActivityDetails => ({
  latestActivityDate: event.date,
  latestActivityByGroup: pipe(
    event.date,
    O.fromPredicate(() => eqGroupId.equals(event.editorialCommunityId, groupId)),
  ),
  evaluationCount: 1,
});

const combineActivityDetails = (a: ActivityDetails) => O.fold(
  () => a,
  (b: ActivityDetails) => semigroupActivityDetails.concat(a, b),
);

const updateActivity = (
  event: EditorialCommunityReviewedArticleEvent,
  groupId: GroupId,
) => pipe(
  eventToActivityDetails(event, groupId),
  combineActivityDetails,
);

const eventToActivity = (
  groupId: GroupId,
) => (
  activities: ReadonlyMap<Doi, ActivityDetails>,
  event: EditorialCommunityReviewedArticleEvent,
) => pipe(
  activities,
  RM.lookup(eqDoi)(event.articleId),
  updateActivity(event, groupId),
  (newActivity: ActivityDetails) => RM.upsertAt(eqDoi)(event.articleId, newActivity)(activities),
);

const byLatestActivityDateByGroupDesc: Ord.Ord<ArticleActivity & { latestActivityByGroup: Date }> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap(
    (activityDetails) => (activityDetails.latestActivityByGroup),
  ),
);

const groupHasEvaluatedArticle = <T extends { latestActivityByGroup: O.Option<Date> }>(articleActivities: T) => pipe(
  articleActivities.latestActivityByGroup,
  O.map((latestActivityByGroup) => ({
    ...articleActivities,
    latestActivityByGroup,
  })),
);

export const groupActivities: GroupActivities = (events) => (groupId) => pipe(
  events,
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(RM.empty, eventToActivity(groupId)),
  RM.filterMapWithIndex(flow(
    (doi, activityDetails) => ({ ...activityDetails, doi }),
    groupHasEvaluatedArticle,
  )),
  RM.values(byLatestActivityDateByGroupDesc),
  RA.takeLeft(10),
);
