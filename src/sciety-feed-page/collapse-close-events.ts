import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import { CollapsedGroupEvaluatedArticle, CollapsedGroupEvaluatedMultipleArticles, EventCardModel } from './event-card';
import { GroupEvaluatedArticleEvent, UserFollowedEditorialCommunityEvent, UserSavedArticleEvent } from '../domain-events';

const collapsedGroupEvaluatedArticle = (
  last: GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle,
  evaluationCount: number,
): CollapsedGroupEvaluatedArticle => ({
  type: 'CollapsedGroupEvaluatedArticle',
  groupId: last.groupId,
  articleId: last.articleId,
  date: last.date,
  evaluationCount,
});

type CollapsedGroupEvaluatedMultipleArticlesState = (
  CollapsedGroupEvaluatedMultipleArticles
  & { articleIds: Set<string> }
);

type StateEntry = FeedRelevantEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState;

const collapsedGroupEvaluatedMultipleArticles = (
  last: GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState,
  articleIds: Set<string>,
): CollapsedGroupEvaluatedMultipleArticlesState => ({
  type: 'CollapsedGroupEvaluatedMultipleArticles',
  groupId: last.groupId,
  articleIds,
  articleCount: articleIds.size,
  date: last.date,
});

type Collapsable =
GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState;

const isCollapsable = (entry: StateEntry): entry is Collapsable => match(entry)
  .with({ type: 'GroupEvaluatedArticle' }, () => true)
  .with({ type: 'CollapsedGroupEvaluatedArticle' }, () => true)
  .with({ type: 'CollapsedGroupEvaluatedMultipleArticles' }, () => true)
  .otherwise(() => false);

const processEvent = (
  state: Array<StateEntry>, event: FeedRelevantEvent,
) => pipe(
  {
    prevEntry: pipe(
      state,
      RA.last,
      O.filter(isCollapsable),
    ),
    candidate: pipe(
      event,
      O.fromPredicate((e): e is GroupEvaluatedArticleEvent => e.type === 'GroupEvaluatedArticle'),
    ),
  },
  sequenceS(O.Apply),
  O.filter(({ prevEntry, candidate }) => prevEntry.groupId === candidate.groupId),
  O.map((collapsablePair) => match(collapsablePair)
    .with(
      { prevEntry: { type: 'GroupEvaluatedArticle' } },
      (pair) => pair.prevEntry.articleId.value === pair.candidate.articleId.value,
      (pair) => collapsedGroupEvaluatedArticle(pair.prevEntry, 2),
    )
    .with(
      { prevEntry: { type: 'GroupEvaluatedArticle' } },
      (pair) => pair.prevEntry.articleId.value !== pair.candidate.articleId.value,
      (pair) => collapsedGroupEvaluatedMultipleArticles(
        pair.prevEntry, new Set([pair.prevEntry.articleId.value, pair.candidate.articleId.value]),
      ),
    )
    .with(
      { prevEntry: { type: 'CollapsedGroupEvaluatedArticle' } },
      (pair) => pair.prevEntry.articleId.value === pair.candidate.articleId.value,
      (pair) => collapsedGroupEvaluatedArticle(pair.prevEntry, pair.prevEntry.evaluationCount + 1),
    )
    .with(
      { prevEntry: { type: 'CollapsedGroupEvaluatedArticle' } },
      (pair) => pair.prevEntry.articleId.value !== pair.candidate.articleId.value,
      (pair) => collapsedGroupEvaluatedMultipleArticles(
        pair.prevEntry, new Set([pair.prevEntry.articleId.value, pair.candidate.articleId.value]),
      ),
    )
    .with(
      { prevEntry: { type: 'CollapsedGroupEvaluatedMultipleArticles' } },
      (pair) => collapsedGroupEvaluatedMultipleArticles(
        pair.prevEntry, pair.prevEntry.articleIds.add(pair.candidate.articleId.value),
      ),
    )
    .otherwise(() => event)),
  O.fold(
    () => { state.push(event); return state; },
    (collapsed) => { state.splice(-1, 1, collapsed); return state; },
  ),
);

export type FeedRelevantEvent =
  UserSavedArticleEvent | UserFollowedEditorialCommunityEvent | GroupEvaluatedArticleEvent;

export const collapseCloseEvents = (
  events: ReadonlyArray<FeedRelevantEvent>,
): ReadonlyArray<EventCardModel> => events.reduce(processEvent, []);
