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
import { GroupId } from '../types/group-id';

type ArticleActivity = { doi: Doi, latestActivityDate: Date, evaluationCount: number };

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
  evaluatedByFollowedGroup: groupIds.includes(event.editorialCommunityId),
  evaluationCount: 1,
});

const mostRecentDate = (a: Date, b: Date) => (a.getTime() > b.getTime() ? a : b);

const mergeActivities = (
  event: EditorialCommunityReviewedArticleEvent,
  groupIds: ReadonlyArray<GroupId>,
) => (existingActivityDate: ActivityDetails): ActivityDetails => pipe(
  eventToActivityDetails(event, groupIds),
  (newActivityDetails: ActivityDetails): ActivityDetails => ({
    evaluatedByFollowedGroup:
      newActivityDetails.evaluatedByFollowedGroup || existingActivityDate.evaluatedByFollowedGroup,
    evaluationCount: existingActivityDate.evaluationCount + 1,
    latestActivityDate: mostRecentDate(existingActivityDate.latestActivityDate, newActivityDetails.latestActivityDate),
  }),
);

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
    mergeActivities(event, groupIds),
  ),
  (activity) => pipe(activities, RM.upsertAt(eqDoi)(event.articleId, activity)),
);

const byLatestActivityDateByGroupDesc: Ord.Ord<ArticleActivity> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap(
    (activityDetails) => (activityDetails.latestActivityDate),
  ),
);

// ts-unused-exports:disable-next-line
export const followedGroupsActivities: FollowedGroupsActivities = (events) => (groupIds) => pipe(
  events,
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(RM.empty, addEventToActivities(groupIds)),
  RM.filterMapWithIndex(flow(
    (doi, activityDetails) => O.some({ doi, ...activityDetails }),
    O.filter((activityDetails) => activityDetails.evaluatedByFollowedGroup),
  )),
  RM.values(byLatestActivityDateByGroupDesc),
  RA.takeLeft(20),
);
