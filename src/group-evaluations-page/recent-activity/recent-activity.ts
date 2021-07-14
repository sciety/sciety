import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { constructRecentGroupActivity } from './construct-recent-group-activity';
import { fetchArticleDetails } from '../../shared-components/article-card/fetch-article-details';
import { FindVersionsForArticleDoi, getLatestArticleVersionDate } from '../../shared-components/article-card/get-latest-article-version-date';
import { ArticleServer } from '../../types/article-server';
import { Doi } from '../../types/doi';
import { DomainEvent } from '../../types/domain-events';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

type Article = {
  title: SanitisedHtmlFragment,
  server: ArticleServer,
  authors: ReadonlyArray<string>,
};

type GetArticle = (id: Doi) => TE.TaskEither<unknown, Article>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  fetchArticle: GetArticle,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
  getAllEvents: GetAllEvents,
};

type RecentActivity = (ports: Ports) => (group: Group) => TE.TaskEither<never, HtmlFragment>;

export const recentActivity: RecentActivity = (ports) => (group) => pipe(
  constructRecentGroupActivity(
    fetchArticleDetails(
      getLatestArticleVersionDate(ports.findVersionsForArticleDoi),
      flow(ports.fetchArticle, T.map(O.fromEither)),
    ),
    ports.getAllEvents,
  )(group.id, 1),
  TE.rightTask,
);
