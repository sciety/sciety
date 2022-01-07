import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as S from 'fp-ts/Semigroup';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import {
  DomainEvent, EvaluationRecordedEvent,
  isEvaluationRecordedEvent,
} from '../../domain-events';
import { getActivityForDoi } from '../../shared-read-models/article-activity';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';

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
  event: EvaluationRecordedEvent,
  groupId: GroupId,
): ActivityDetails => ({
  latestActivityDate: event.publishedAt,
  latestActivityByGroup: pipe(
    event.date,
    O.fromPredicate(() => event.groupId === groupId),
  ),
  evaluationCount: 1,
});

const combineActivityDetails = (a: ActivityDetails) => O.fold(
  () => a,
  (b: ActivityDetails) => semigroupActivityDetails.concat(a, b),
);

const updateActivity = (
  event: EvaluationRecordedEvent,
  groupId: GroupId,
) => pipe(
  eventToActivityDetails(event, groupId),
  combineActivityDetails,
);

const addEventToActivities = (
  groupId: GroupId,
) => (
  activities: Map<string, ActivityDetails>,
  event: EvaluationRecordedEvent,
) => pipe(
  activities.get(event.articleId.value),
  O.fromNullable,
  updateActivity(event, groupId),
  (activity) => activities.set(event.articleId.value, activity),
);

const byLatestActivityDateByGroupDesc: Ord.Ord<{
  doi: Doi,
  latestActivityDate: Date,
  evaluationCount: number,
  latestActivityByGroup: Date,
}> = pipe(
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

export const evaluatedArticles = (groupId: GroupId) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<ArticleActivity> => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.reduce(new Map(), addEventToActivities(groupId)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => ({ ...activityDetails, doi: new Doi(key) }),
    groupHasEvaluatedArticle,
  )),
  RM.values(byLatestActivityDateByGroupDesc),
  RA.map((activity) => ({
    ...activity,
    latestActivityDate: O.some(activity.latestActivityDate),
    listMembershipCount: pipe(
      events,
      getActivityForDoi(activity.doi),
      (act) => act.listMembershipCount,
    ),
  })),
);
