import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { constant, flow, pipe } from 'fp-ts/function';
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

type AllGroupActivities = (
  groupId: GroupId
) => (
  events: ReadonlyArray<DomainEvent>
) => ReadonlyMap<Doi, ActivityDetails>;

const updateActivities = (
  groupId: GroupId,
) => (
  activities: ReadonlyMap<Doi, ActivityDetails>,
  event: EditorialCommunityReviewedArticleEvent,
) => pipe(
  activities,
  RM.lookup(eqDoi)(event.articleId),
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
  (newActivity: ActivityDetails) => RM.upsertAt(eqDoi)(event.articleId, newActivity)(activities),
);

const allGroupActivities: AllGroupActivities = (groupId) => flow(
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(RM.empty, updateActivities(groupId)),
);

type Activity = { groupId: GroupId, articleId: Doi };

const doisEvaluatedByGroup = (events: ReadonlyArray<DomainEvent>, groupId: GroupId) => pipe(
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
);

const addActivitiesDetailsToDois = (dois: ReadonlyArray<Doi>, activities: ReadonlyMap<Doi, ActivityDetails>) => pipe(
  dois,
  RA.map((doi) => pipe(
    activities,
    RM.lookup(eqDoi)(doi),
    O.map((activityDetails) => ({ ...activityDetails, doi })),
  )),
);

export const groupActivities: GroupActivities = (events) => (groupId) => pipe(
  I.Do,
  I.apS('dois', doisEvaluatedByGroup(events, groupId)),
  I.apS('activities', pipe(events, allGroupActivities(groupId))),
  ({ activities, dois }) => addActivitiesDetailsToDois(dois, activities),
  O.sequenceArray,
  O.map(RA.takeLeft(10)),
  O.getOrElseW(() => []),
);
