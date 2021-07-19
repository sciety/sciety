import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as S from 'fp-ts/Semigroup';
import { flow, pipe } from 'fp-ts/function';
import * as N from 'fp-ts/number';
import { ArticleActivity } from '../../types/article-activity';
import * as DE from '../../types/data-error';
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

// ts-unused-exports:disable-next-line
export type GroupActivities = E.Either<DE.DataError, {
  content: ReadonlyArray<ArticleActivity>,
  nextPageNumber: O.Option<number>,
  articleCount: number,
}>;

type CalculateGroupActivities = (
  groupId: GroupId,
  page: number,
  pageSize: number,
) => (events: ReadonlyArray<DomainEvent>) => GroupActivities;

const paginate = (page: number, pageSize: number) => (allEvaluatedArticles: ReadonlyArray<ArticleActivity>) => (
  (allEvaluatedArticles.length === 0) ? E.right({
    content: [],
    nextPageNumber: O.none,
    articleCount: 0,
  }) : pipe(
    allEvaluatedArticles,
    RA.chunksOf(pageSize),
    RA.lookup(page - 1),
    E.fromOption(() => DE.notFound),
    E.map((content) => ({
      content,
      nextPageNumber: pipe(
        page + 1,
        O.some,
        O.filter((nextPage) => nextPage <= Math.ceil(allEvaluatedArticles.length / pageSize)),
      ),
      articleCount: allEvaluatedArticles.length,
    })),
  )
);

export const groupActivities: CalculateGroupActivities = (groupId, page, pageSize) => flow(
  RA.filter(isEditorialCommunityReviewedArticleEvent),
  RA.reduce(new Map(), addEventToActivities(groupId)),
  RM.filterMapWithIndex(flow(
    (key, activityDetails) => ({ ...activityDetails, doi: new Doi(key) }),
    groupHasEvaluatedArticle,
  )),
  RM.values(byLatestActivityDateByGroupDesc),
  paginate(page, pageSize),
);
