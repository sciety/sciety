import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, EventOfType, isEventOfType } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { ExpressionActivity } from '../../../types/expression-activity';
import { ExpressionDoi } from '../../../types/expression-doi';
import { GroupId } from '../../../types/group-id';

type ArticleActivityDetails = {
  mostRecentRecordedEvaluationByFollowedGroups: Date,
  latestArticleActivityDate: Date,
  evaluatedByFollowedGroup: boolean,
  evaluationCount: number,
};

const eventToActivityDetails = (
  event: EventOfType<'EvaluationPublicationRecorded'>,
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
  activities: Map<ExpressionDoi, ArticleActivityDetails>,
  event: EventOfType<'EvaluationPublicationRecorded'>,
) => pipe(
  activities.get(event.articleId),
  O.fromNullable,
  O.match(
    () => eventToActivityDetails(event, groupIds),
    (existingActivityDetails) => mergeActivities(existingActivityDetails, eventToActivityDetails(event, groupIds)),
  ),
  (activity) => activities.set(event.articleId, activity),
);

const byMostRecentRecordedEvaluationByFollowedGroups: Ord.Ord<{
  expressionDoi: ArticleId,
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
) => (groupIds: ReadonlyArray<GroupId>) => ReadonlyArray<ExpressionActivity>;

export const followedGroupsActivities: FollowedGroupsActivities = (events) => (groupIds) => pipe(
  events,
  RA.filter(isEventOfType('EvaluationPublicationRecorded')),
  RA.reduce(new Map(), addEventToActivities(groupIds)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => O.some({
      expressionDoi: new ArticleId(key),
      ...activityDetails,
    }),
    O.filter((activityDetails) => activityDetails.evaluatedByFollowedGroup),
  )),
  RM.values(byMostRecentRecordedEvaluationByFollowedGroups),
  RA.map((activity) => ({
    ...activity,
    latestActivityAt: O.some(activity.latestArticleActivityDate),
    listMembershipCount: 0,
  })),
);
