import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as S from 'fp-ts/Semigroup';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import {
  DomainEvent, EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../../types/domain-events';
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
  event: EditorialCommunityReviewedArticleEvent,
  groupId: GroupId,
): ActivityDetails => ({
  latestActivityDate: event.date,
  latestActivityByGroup: pipe(
    event.date,
    O.fromPredicate(() => event.editorialCommunityId === groupId),
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

const addEventToActivities = (
  groupId: GroupId,
) => (
  activities: Map<string, ActivityDetails>,
  event: EditorialCommunityReviewedArticleEvent,
) => pipe(
  activities.get(event.articleId.value),
  O.fromNullable,
  updateActivity(event, groupId),
  (activity) => activities.set(event.articleId.value, activity),
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

export const evaluatedArticles = (groupId: GroupId) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<ArticleActivity> => pipe(
  events,
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(new Map(), addEventToActivities(groupId)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => ({ ...activityDetails, doi: new Doi(key) }),
    groupHasEvaluatedArticle,
  )),
  RM.values(byLatestActivityDateByGroupDesc),
);
