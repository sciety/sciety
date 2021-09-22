import { htmlEscape } from 'escape-goat';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { constant, pipe } from 'fp-ts/function';
import { GroupEvaluatedArticleEvent } from '../domain-events';
import { templateDate } from '../shared-components/date';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

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
  TE.map(({ group, article }) => ({
    group,
    article,
    authors: pipe(
      article.authors,
      RA.map((author) => `<li class="sciety-feed-card__author">${htmlEscape(author)}</li>`),
      (authorListItems) => `
        <ol class="sciety-feed-card__authors" role="list">
          ${authorListItems.join('')}
        </ol>
      `,
      toHtmlFragment,
    ),
  })),
  TE.map(({ group, article, authors }) => `
    <article class="sciety-feed-card">
      <a href="/articles/${article.doi.value}" class="sciety-feed-card__link">
        <div class="sciety-feed-card__event_title">
          <img class="sciety-feed-card__avatar" src="${group.avatarPath}" alt="">
          <h2 class="sciety-feed-card__event_title_text">${group.name} evaluated an article</h3>
          ${templateDate(event.date, 'sciety-feed-card__event_date')}
        </div>
        <div class="sciety-feed-card__article_details">
          <h3>${article.title}</h4>
          ${authors}
        </div>
      </a>
    </article>
  `),
  TE.map(toHtmlFragment),
);
