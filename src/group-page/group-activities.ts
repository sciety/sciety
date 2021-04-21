import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
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

const updateActivity = (
  event: EditorialCommunityReviewedArticleEvent,
  groupId: GroupId,
): (
  activity: O.Option<ActivityDetails>
  ) => ActivityDetails => flow(
  O.getOrElseW(() => ({ latestActivityByGroup: O.none, evaluationCount: 0 })),
  (oldActivity) => ({
    latestActivityDate: event.date,
    latestActivityByGroup: pipe(
      event.date,
      O.fromPredicate(() => eqGroupId.equals(event.editorialCommunityId, groupId)),
      O.alt(() => oldActivity.latestActivityByGroup),
    ),
    evaluationCount: oldActivity.evaluationCount + 1,
  }),
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
