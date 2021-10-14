import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ScietyFeedCard } from './sciety-feed-card';
import { GroupEvaluatedArticleEvent } from '../../domain-events';
import { renderAuthors } from '../../shared-components/render-card-authors';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

type GetGroup = (id: GroupId) => TE.TaskEither<DE.DataError, Group>;

type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: HtmlFragment,
  authors: ReadonlyArray<string>,
}>;

export type GroupEvaluatedArticleCard = {
  groupId: GroupId,
  articleId: Doi,
  evaluationCount: number,
  date: Date,
};

export type Ports = {
  getGroup: GetGroup,
  fetchArticle: FetchArticle,
};

export const groupEvaluatedArticleCard = (ports: Ports) => (
  event: GroupEvaluatedArticleCard | GroupEvaluatedArticleEvent,
): TE.TaskEither<DE.DataError, ScietyFeedCard> => pipe(
  {
    group: pipe(
      event.groupId,
      ports.getGroup,
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
