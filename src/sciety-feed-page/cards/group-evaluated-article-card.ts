import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { DomainEvent, GroupEvaluatedArticleEvent } from '../../domain-events';
import { renderAuthors } from '../../shared-components/render-card-authors';
import { getGroup } from '../../shared-read-models/all-groups';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: HtmlFragment,
  authors: O.Option<ReadonlyArray<string>>,
}>;

export type GroupEvaluatedArticleCard = {
  groupId: GroupId,
  articleId: Doi,
  evaluationCount: number,
  date: Date,
};

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  fetchArticle: FetchArticle,
};

export const groupEvaluatedArticleCard = (ports: Ports) => (
  event: GroupEvaluatedArticleCard | GroupEvaluatedArticleEvent,
): TE.TaskEither<DE.DataError, ScietyFeedCard> => pipe(
  {
    group: pipe(
      ports.getAllEvents,
      T.map(getGroup(event.groupId)),
    ),
    details: pipe(
      event.articleId,
      ports.fetchArticle,
      TE.match(
        () => undefined,
        (article) => ({
          title: article.title,
          content: renderAuthors(article.authors, `sciety-feed-card-author-list-${event.groupId}-${article.doi.value}`),
        }),
      ),
      TE.rightTask,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ group, details }) => pipe(
    {
      titleText: `${group.name} evaluated an article`,
      linkUrl: `/articles/${event.articleId.value}`,
      avatarUrl: group.avatarPath,
      date: event.date,
      details,
    },
  )),
);
