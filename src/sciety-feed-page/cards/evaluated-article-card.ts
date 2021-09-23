import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import { scietyFeedCard } from './sciety-feed-card';
import { GroupEvaluatedArticleEvent } from '../../domain-events';
import { renderAuthors } from '../../shared-components/render-card-authors';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { Group } from '../../types/group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';

type GetGroup = (id: GroupId) => TO.TaskOption<Group>;

export type FetchArticle = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: HtmlFragment,
  authors: ReadonlyArray<string>,
}>;

export type EvaluatedArticleCard = {
  groupId: GroupId,
  articleId: Doi,
  evaluationCount: number,
  date: Date,
};

export const evaluatedArticleCard = (
  getGroup: GetGroup,
  fetchArticle: FetchArticle,
) => (
  event: EvaluatedArticleCard | GroupEvaluatedArticleEvent,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  {
    group: pipe(
      event.groupId,
      getGroup,
      T.map(E.fromOption(constant(DE.unavailable))),
    ),
    article: pipe(
      event.articleId,
      fetchArticle,
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map(({ group, article }) => pipe(
    {
      titleText: `${group.name} evaluated an article`,
      linkUrl: `/articles/${article.doi.value}`,
      avatarUrl: group.avatarPath,
      date: event.date,
      details: {
        title: article.title,
        content: renderAuthors(article.authors, `sciety-feed-card-author-list-${group.id}-${article.doi.value}`),
      },
    },
    scietyFeedCard,
  )),
);
