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

const isCollapsedGroupEvaluatedArticle = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedArticle => entry.type === 'CollapsedGroupEvaluatedArticle';

const isCollapsedGroupEvaluatedMultipleArticlesState = (
  entry: StateEntry,
): entry is CollapsedGroupEvaluatedMultipleArticlesState => entry.type === 'CollapsedGroupEvaluatedMultipleArticles';

const isGroupEvaluatedArticleEvent = (event: StateEntry):
  event is GroupEvaluatedArticleEvent => (
  event.type === 'GroupEvaluatedArticle'
);

type Collapsable =
GroupEvaluatedArticleEvent | CollapsedGroupEvaluatedArticle | CollapsedGroupEvaluatedMultipleArticlesState;

const isCollapsable = (entry: StateEntry): entry is Collapsable => match(entry)
  .with({ type: 'GroupEvaluatedArticle' }, () => true)
  .with({ type: 'CollapsedGroupEvaluatedArticle' }, () => true)
  .with({ type: 'CollapsedGroupEvaluatedMultipleArticles' }, () => true)
  .otherwise(() => false);

const collapse = (
  last: Collapsable,
  event: GroupEvaluatedArticleEvent,
) => {
  if (isGroupEvaluatedArticleEvent(last)) {
    if (event.articleId.value === last.articleId.value) {
      return (collapsedGroupEvaluatedArticle(last, 2));
    }
    return (collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
  } if (isCollapsedGroupEvaluatedArticle(last)) {
    if (event.articleId.value === last.articleId.value) {
      return (collapsedGroupEvaluatedArticle(last, last.evaluationCount + 1));
    }
    return (collapsedGroupEvaluatedMultipleArticles(last, new Set([last.articleId.value, event.articleId.value])));
  } if (isCollapsedGroupEvaluatedMultipleArticlesState(last)) {
    return (collapsedGroupEvaluatedMultipleArticles(last, last.articleIds.add(event.articleId.value)));
  }

  throw new Error('should not happen');
};

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
  O.filter((pair) => pair.candidate.groupId === pair.prevEntry.groupId),
  O.map(({ prevEntry, candidate }) => collapse(prevEntry, candidate)),
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
