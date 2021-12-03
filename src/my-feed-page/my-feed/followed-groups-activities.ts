import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent, EvaluationRecordedEvent,
  isEvaluationRecordedEvent,
} from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';

type ArticleActivityDetails = {
  mostRecentRecordedEvaluationByFollowedGroups: Date,
  latestArticleActivityDate: Date,
  evaluatedByFollowedGroup: boolean,
  evaluationCount: number,
};

const eventToActivityDetails = (
  event: EvaluationRecordedEvent,
  groupIds: ReadonlyArray<GroupId>,
): ArticleActivityDetails => ({
  mostRecentRecordedEvaluationByFollowedGroups: event.date,
  latestArticleActivityDate: event.publishedAt,
  evaluatedByFollowedGroup: groupIds.map((groupId) => groupId).includes(event.groupId),
  evaluationCount: 1,
});

const mostRecentDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b);

const mergeActivities = (
  existingActivityDetails: ArticleActivityDetails,
  newActivityDetails: ArticleActivityDetails,
): ArticleActivityDetails => ({
  mostRecentRecordedEvaluationByFollowedGroups: (newActivityDetails.evaluatedByFollowedGroup)
    ? mostRecentDate(
      existingActivityDetails.mostRecentRecordedEvaluationByFollowedGroups,
      newActivityDetails.mostRecentRecordedEvaluationByFollowedGroups,
    )
    : existingActivityDetails.mostRecentRecordedEvaluationByFollowedGroups,
  latestArticleActivityDate: mostRecentDate(
    existingActivityDetails.latestArticleActivityDate,
    newActivityDetails.latestArticleActivityDate,
  ),
  evaluatedByFollowedGroup:
      existingActivityDetails.evaluatedByFollowedGroup || newActivityDetails.evaluatedByFollowedGroup,
  evaluationCount: existingActivityDetails.evaluationCount + newActivityDetails.evaluationCount,
});

const addEventToActivities = (
  groupIds: ReadonlyArray<GroupId>,
) => (
  activities: Map<string, ArticleActivityDetails>,
  event: EvaluationRecordedEvent,
) => pipe(
  activities.get(event.articleId.value),
  O.fromNullable,
  O.fold(
    () => eventToActivityDetails(event, groupIds),
    (existingActivityDetails) => mergeActivities(existingActivityDetails, eventToActivityDetails(event, groupIds)),
  ),
  (activity) => activities.set(event.articleId.value, activity),
);

const byMostRecentRecordedEvaluationByFollowedGroups: Ord.Ord<{
  doi: Doi,
  mostRecentRecordedEvaluationByFollowedGroups: Date,
  latestArticleActivityDate: Date,
  evaluationCount: number,
}> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap(
    (activityDetails) => (activityDetails.mostRecentRecordedEvaluationByFollowedGroups),
  ),
);

type FollowedGroupsActivities = (
  events: ReadonlyArray<DomainEvent>
) => (groupIds: ReadonlyArray<GroupId>) => ReadonlyArray<ArticleActivity>;

export const followedGroupsActivities: FollowedGroupsActivities = (events) => (groupIds) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.reduce(new Map(), addEventToActivities(groupIds)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => O.some({ doi: new Doi(key), ...activityDetails }),
    O.filter((activityDetails) => activityDetails.evaluatedByFollowedGroup),
  )),
  RM.values(byMostRecentRecordedEvaluationByFollowedGroups),
  RA.map((activity) => ({
    ...activity,
    latestActivityDate: O.some(activity.latestArticleActivityDate),
  })),
);
