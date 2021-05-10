import * as D from 'fp-ts/Date';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import { ArticleActivity } from '../../types/article-activity';
import { Doi, eqDoi } from '../../types/doi';
import {
  DomainEvent, EditorialCommunityReviewedArticleEvent,
  isEditorialCommunityReviewedArticleEvent,
} from '../../types/domain-events';
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
  event: EditorialCommunityReviewedArticleEvent,
  groupIds: ReadonlyArray<GroupId>,
): ActivityDetails => ({
  latestActivityDate: event.date,
  evaluatedByFollowedGroup: groupIds.map((groupId) => groupId.value).includes(event.editorialCommunityId.value),
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
  activities: ReadonlyMap<Doi, ActivityDetails>,
  event: EditorialCommunityReviewedArticleEvent,
) => pipe(
  activities,
  RM.lookup(eqDoi)(event.articleId),
  O.fold(
    () => eventToActivityDetails(event, groupIds),
    (existingActivityDetails) => mergeActivities(existingActivityDetails, eventToActivityDetails(event, groupIds)),
  ),
  (activity) => pipe(activities, RM.upsertAt(eqDoi)(event.articleId, activity)),
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
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(RM.empty, addEventToActivities(groupIds)),
  RM.filterMapWithIndex(flow(
    (doi, activityDetails) => O.some({ doi, ...activityDetails }),
    O.filter((activityDetails) => activityDetails.evaluatedByFollowedGroup),
  )),
  RM.values(byLatestActivityDateDesc),
  RA.takeLeft(20),
);
