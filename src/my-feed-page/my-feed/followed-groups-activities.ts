import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent, GroupEvaluatedArticleEvent,
  isGroupEvaluatedArticleEvent,
} from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';

type FollowedGroupsActivities = (
  events: ReadonlyArray<DomainEvent>
) => (groupIds: ReadonlyArray<GroupId>) => ReadonlyArray<ArticleActivity>;

type ActivityDetails = {
  latestActivityDate: Date,
  evaluatedByFollowedGroup: boolean,
  evaluationCount: number,
};

const eventToActivityDetails = (
  event: GroupEvaluatedArticleEvent,
  groupIds: ReadonlyArray<GroupId>,
): ActivityDetails => ({
  latestActivityDate: event.date,
  evaluatedByFollowedGroup: groupIds.map((groupId) => groupId).includes(event.groupId),
  evaluationCount: 1,
});

const mostRecentDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b);

const mergeActivities = (
  existingActivityDetails: ActivityDetails,
  newActivityDetails: ActivityDetails,
): ActivityDetails => ({
  latestActivityDate: mostRecentDate(
    existingActivityDetails.latestActivityDate,
    newActivityDetails.latestActivityDate,
  ),
  evaluatedByFollowedGroup:
      existingActivityDetails.evaluatedByFollowedGroup || newActivityDetails.evaluatedByFollowedGroup,
  evaluationCount: existingActivityDetails.evaluationCount + newActivityDetails.evaluationCount,
});

const addEventToActivities = (
  groupIds: ReadonlyArray<GroupId>,
) => (
  activities: Map<string, ActivityDetails>,
  event: GroupEvaluatedArticleEvent,
) => pipe(
  activities.get(event.articleId.value),
  O.fromNullable,
  O.fold(
    () => eventToActivityDetails(event, groupIds),
    (existingActivityDetails) => mergeActivities(existingActivityDetails, eventToActivityDetails(event, groupIds)),
  ),
  (activity) => activities.set(event.articleId.value, activity),
);

const byLatestActivityDateDesc: Ord.Ord<ArticleActivity> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap(
    (activityDetails) => (activityDetails.latestActivityDate),
  ),
);

export const followedGroupsActivities: FollowedGroupsActivities = (events) => (groupIds) => pipe(
  events,
  RA.filter(isGroupEvaluatedArticleEvent),
  RA.reduce(new Map(), addEventToActivities(groupIds)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => O.some({ doi: new Doi(key), ...activityDetails }),
    O.filter((activityDetails) => activityDetails.evaluatedByFollowedGroup),
  )),
  RM.values(byLatestActivityDateDesc),
  RA.takeLeft(20),
);
